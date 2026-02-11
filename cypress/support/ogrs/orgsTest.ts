import * as fs from 'fs-extra'

import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters, TestCaseParameters, TestCaseResult } from '../../../oasys/ogrs/types'
import { calculateTestCase } from './ogrsCalculator'
import { loadParameterSet, loadOracleOutputValues } from './loadTestData'
import { getOgrsResult, offences } from '../data/oasysDb'
import { getAssessmentTestData, getRsrTestData } from './getTestData/getTestData'
import { createAssessmentTestCase } from 'ogrs/createAssessmentTestCase'
import { createRsrTestCase } from './getTestData/createRsrTestCase'
import { OgrsRsr } from './getTestData/dbClasses'
import { stringParameterToString, numericParameterToString } from 'lib/utils'
import { appVersions, OasysDateTime } from 'lib/dateTime'
import { createOutputObject } from 'ogrs/createOutput'
import { OgrsAssessment } from './getTestData/dbClasses'

const dataFilePath = './cypress/support/ogrs/data/'

export async function ogrsTest(testParams: OgrsTestParameters): Promise<OgrsTestScriptResult> {

    const scriptResults: OgrsTestScriptResult = {
        testCaseResults: [],
        cases: 0,
        failures: 0,
        offenceCodeErrors: [],
        packageTimestamp: '',
    }

    // Load input parameters from a CSV file
    if (testParams.testType == 'csv') {
        const inputParameterFile = await fs.readFile(`${dataFilePath}${testParams.csvDetails.dataFile}.csv`, 'utf8')
        const inputParameters = inputParameterFile.split('\r\n')

        const start = testParams.csvDetails.start ?? 0
        const end = testParams.csvDetails.end ?? inputParameters.length - 1

        for (let i = start; i <= end; i++) {
            const errorLog: string[] = []
            scriptResults.cases++
            try {
                const testCaseParams = loadParameterSet(inputParameters[i], offences)
                errorLog.push(`    Input parameters: ${JSON.stringify(testCaseParams)}`)
                if (testParams.staticFlag) {
                    testCaseParams.STATIC_CALC = testParams.staticFlag
                }

                let oracleTestCaseValues = ''
                let oracleTestCaseResult: OutputParameters

                const functionCall = getFunctionCall(testCaseParams)
                errorLog.push(`    Oracle call:    ${JSON.stringify(functionCall)}`)
                oracleTestCaseValues = await getOgrsResult(functionCall)
                errorLog.push(`    Oracle  results:   ${oracleTestCaseValues}`)
                oracleTestCaseResult = loadOracleOutputValues(oracleTestCaseValues.split('|'))

                errorLog.push(`    Oracle  result object:   ${JSON.stringify(oracleTestCaseResult)}`)
                const testCaseIdentifier = (i)?.toString() ?? 'null'

                const testCaseResult = calculateTestCase(testCaseParams, oracleTestCaseResult, testCaseIdentifier, testParams)

                if (!testParams.includeObjects) {
                    testCaseResult.inputParams = null
                    testCaseResult.outputParams = null
                }
                scriptResults.testCaseResults.push(testCaseResult)
                if (testCaseResult.failed) {
                    scriptResults.failures++
                    console.log(testCaseResult.identifier)
                }
                // count missing/invalid offence codes
                if (!testCaseParams.offenceCat) {
                    scriptResults.offenceCodeErrors.push(testCaseParams.OFFENCE_CODE)
                }
            } catch (e) {
                const logText: string[] = ['']
                if (testParams.reportMode != 'none') {
                    logText.push(`Test case ${i}  ERROR *** FAILED ***`)
                    logText.push(`    Error:   ${e}`)
                    errorLog.forEach((line) => logText.push(line))
                }
                scriptResults.testCaseResults.push({
                    logText: logText,
                    inputParams: null,
                    outputParams: null,
                    failed: true,
                    identifier: null,
                })
                scriptResults.failures++
            }
        }
    }

    // Create test cases using OASys assessment data
    if (testParams.testType == 'db') {

        const oasysData: OgrsAssessment[] | OgrsRsr[] =
            testParams.dbDetails.type == 'assessment' ? await getAssessmentTestData(testParams.dbDetails.count, testParams.dbDetails.whereClause)
                : await getRsrTestData(testParams.dbDetails.count, testParams.dbDetails.whereClause)
        for (const assessmentOrRsr of oasysData) {
            const errorLog: string[] = []
            try {
                const testCaseParams = testParams.dbDetails.type == 'assessment' ?
                    createAssessmentTestCase(assessmentOrRsr as OgrsAssessment, offences, appVersions) : createRsrTestCase(assessmentOrRsr as OgrsRsr, offences)
                errorLog.push(`    Input parameters: ${JSON.stringify(testCaseParams)}`)
                // Run generate two sets of scores, for static flag Y and N
                for (let staticFlag of ['Y', 'N']) {
                    scriptResults.cases++
                    testCaseParams.STATIC_CALC = staticFlag

                    let oracleTestCaseResult: OutputParameters
                    if (testParams.cypressOnly != true) {

                        // Call the calculator in Oracle unless switched off in test parameters
                        const functionCall = getFunctionCall(testCaseParams)
                        errorLog.push(`    Oracle call:    ${JSON.stringify(functionCall)}`)
                        const oracleTestCaseValues = await getOgrsResult(functionCall)
                        errorLog.push(`    Oracle  results:   ${oracleTestCaseValues}`)

                        oracleTestCaseResult = loadOracleOutputValues(oracleTestCaseValues.split('|'))
                        errorLog.push(`    Oracle  result object:   ${JSON.stringify(oracleTestCaseResult)}`)
                    } else {
                        oracleTestCaseResult = createOutputObject()
                    }

                    // Call the calculator in Cypress and compare against the Oracle result
                    const testCaseResult = calculateTestCase(testCaseParams, oracleTestCaseResult, assessmentOrRsr.pk.toString(), testParams)

                    if (!testParams.includeObjects) {
                        testCaseResult.inputParams = null
                        testCaseResult.outputParams = null
                    }
                    scriptResults.testCaseResults.push(testCaseResult)
                    if (testCaseResult.failed) {
                        scriptResults.failures++
                        console.log(testCaseResult.identifier)
                    }
                }
            } catch (e) {
                const logText: string[] = ['']
                if (testParams.reportMode != 'none') {
                    logText.push(`Test case ${assessmentOrRsr.pk.toString()}  ERROR *** FAILED ***`)
                    logText.push(`    Error:   ${e}`)
                    errorLog.forEach((line) => logText.push(line))
                }
                scriptResults.testCaseResults.push({
                    logText: logText,
                    inputParams: null,
                    outputParams: null,
                    failed: true,
                    identifier: null,
                })
                scriptResults.failures++
            }
        }
    }


    return scriptResults
}

function getFunctionCall(params: TestCaseParameters): string {

    let result: string[] = []

    result.push(`eor.new_gen_predictors_pkg.get_ogrs4(${OasysDateTime.dateParameterToString(params.ASSESSMENT_DATE)}`)
    result.push(stringParameterToString(params.STATIC_CALC))
    result.push(OasysDateTime.dateParameterToString(params.DOB))
    result.push(stringParameterToString(params.GENDER))
    result.push(stringParameterToString(params.OFFENCE_CODE))
    result.push(numericParameterToString(params.TOTAL_SANCTIONS_COUNT))
    result.push(numericParameterToString(params.TOTAL_VIOLENT_SANCTIONS))
    result.push(numericParameterToString(params.CONTACT_ADULT_SANCTIONS))
    result.push(numericParameterToString(params.CONTACT_CHILD_SANCTIONS))
    result.push(numericParameterToString(params.INDECENT_IMAGE_SANCTIONS))
    result.push(numericParameterToString(params.PARAPHILIA_SANCTIONS))
    result.push(stringParameterToString(params.STRANGER_VICTIM))
    result.push(numericParameterToString(params.AGE_AT_FIRST_SANCTION))
    result.push(OasysDateTime.dateParameterToString(params.LAST_SANCTION_DATE))
    result.push(OasysDateTime.dateParameterToString(params.DATE_RECENT_SEXUAL_OFFENCE))
    result.push(stringParameterToString(params.CURR_SEX_OFF_MOTIVATION))
    result.push(OasysDateTime.dateParameterToString(params.MOST_RECENT_OFFENCE))
    result.push(OasysDateTime.dateParameterToString(params.COMMUNITY_DATE))
    result.push(stringParameterToString(params.ONE_POINT_THIRTY))
    result.push(numericParameterToString(params.TWO_POINT_TWO))
    result.push(numericParameterToString(params.THREE_POINT_FOUR))
    result.push(numericParameterToString(params.FOUR_POINT_TWO))
    result.push(numericParameterToString(params.SIX_POINT_FOUR))
    result.push(numericParameterToString(params.SIX_POINT_SEVEN))
    result.push(numericParameterToString(params.SIX_POINT_EIGHT))
    result.push(numericParameterToString(params.SEVEN_POINT_TWO))
    result.push(stringParameterToString(params.DAILY_DRUG_USER))
    result.push(stringParameterToString(params.AMPHETAMINES))
    result.push(stringParameterToString(params.BENZODIAZIPINES))
    result.push(stringParameterToString(params.CANNABIS))
    result.push(stringParameterToString(params.CRACK_COCAINE))
    result.push(stringParameterToString(params.ECSTASY))
    result.push(stringParameterToString(params.HALLUCINOGENS))
    result.push(stringParameterToString(params.HEROIN))
    result.push(stringParameterToString(params.KETAMINE))
    result.push(stringParameterToString(params.METHADONE))
    result.push(stringParameterToString(params.MISUSED_PRESCRIBED))
    result.push(stringParameterToString(params.OTHER_DRUGS))
    result.push(stringParameterToString(params.OTHER_OPIATE))
    result.push(stringParameterToString(params.POWDER_COCAINE))
    result.push(stringParameterToString(params.SOLVENTS))
    result.push(stringParameterToString(params.SPICE))
    result.push(stringParameterToString(params.STEROIDS))
    result.push(numericParameterToString(params.EIGHT_POINT_EIGHT))
    result.push(numericParameterToString(params.NINE_POINT_ONE))
    result.push(numericParameterToString(params.NINE_POINT_TWO))
    result.push(numericParameterToString(params.ELEVEN_POINT_TWO))
    result.push(numericParameterToString(params.ELEVEN_POINT_FOUR))
    result.push(numericParameterToString(params.TWELVE_POINT_ONE))
    result.push(numericParameterToString(params.OGRS4G_ALGO_VERSION))
    result.push(numericParameterToString(params.OGRS4V_ALGO_VERSION))
    result.push(numericParameterToString(params.OGP2_ALGO_VERSION))
    result.push(numericParameterToString(params.OVP2_ALGO_VERSION))
    result.push(numericParameterToString(params.OSP_ALGO_VERSION))
    result.push(numericParameterToString(params.SNSV_ALGO_VERSION))
    result.push(numericParameterToString(params.AGGRAVATED_BURGLARY))
    result.push(numericParameterToString(params.ARSON))
    result.push(numericParameterToString(params.CRIMINAL_DAMAGE_LIFE))
    result.push(numericParameterToString(params.FIREARMS))
    result.push(numericParameterToString(params.GBH))
    result.push(numericParameterToString(params.HOMICIDE))
    result.push(numericParameterToString(params.KIDNAP))
    result.push(numericParameterToString(params.ROBBERY))
    result.push(numericParameterToString(params.WEAPONS_NOT_FIREARMS))
    result.push(`${stringParameterToString(params.CUSTODY_IND)})`)

    return result.join(',')
}
