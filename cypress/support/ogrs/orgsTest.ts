import * as fs from 'fs-extra'

import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters, TestCaseParameters, TestCaseResult } from './types'
import { calculateTestCase } from './ogrsCalculator'
import { loadParameterSet, loadExpectedValues } from './loadTestData'
import { getOgrsResult } from '../oasysDb'
import { Dayjs } from 'dayjs'
import { createTestCase, getTestData } from './getTestData/getTestData'

const dataFilePath = './cypress/support/ogrs/data/'
export let dateFormat = ''

export async function ogrsTest(testParams: OgrsTestParameters): Promise<OgrsTestScriptResult> {

    dateFormat = testParams.dateFormat
    const scriptResults: OgrsTestScriptResult = {
        testCaseResults: [],
        cases: 0,
        failures: 0,
    }

    // Load input parameters from a CSV file
    if (testParams.dataFile != null) {
        const inputParameterFile = await fs.readFile(`${dataFilePath}${testParams.dataFile}.csv`, 'utf8')
        const inputParameters = inputParameterFile.split('\r\n')

        let expectedResults: string[]
        if (testParams.expectedResultsFile != null) {
            const expectedResultsFile = await fs.readFile(`${dataFilePath}${testParams.expectedResultsFile}.csv`, 'utf8')
            expectedResults = expectedResultsFile.split('\n')
        }

        for (let i = testParams.headers ? 1 : 0; i < inputParameters.length; i++) {
            const errorLog: string[] = []
            scriptResults.cases++
            try {
                const testCaseParams = loadParameterSet(inputParameters[i])
                errorLog.push(`    Input parameters: ${JSON.stringify(testCaseParams)}`)

                let expectedTestCaseValues = ''
                let expectedTestCaseResult: OutputParameters
                if (testParams.expectedResultsFile == null) {
                    const functionCall = getFunctionCall(testCaseParams)
                    errorLog.push(`    Oracle call:    ${JSON.stringify(functionCall)}`)
                    expectedTestCaseValues = await getOgrsResult(functionCall)
                    errorLog.push(`    Oracle  results:   ${expectedTestCaseValues}`)
                    expectedTestCaseResult = loadExpectedValues(expectedTestCaseValues.split('|'))
                } else {
                    expectedTestCaseValues = expectedResults[i]
                    expectedTestCaseResult = loadExpectedValues(expectedTestCaseValues.split(','))
                }

                errorLog.push(`    Oracle  result object:   ${JSON.stringify(expectedTestCaseResult)}`)
                const testCaseIdentifier = (i + 1)?.toString() ?? 'null'

                const testCaseResult = calculateTestCase(testCaseParams, expectedTestCaseResult, testCaseIdentifier, testParams)
                scriptResults.testCaseResults.push(testCaseResult)
                if (testCaseResult.failed) {
                    scriptResults.failures++
                }
            } catch (e) {
                const logText: string[] = ['']
                logText.push(`Test case ${i + 1}  ERROR`)
                logText.push(`    Error:   ${e}`)
                errorLog.forEach((line) => logText.push(line))
                scriptResults.testCaseResults.push({
                    logText: logText,
                    outputParams: null,
                    failed: true,
                })
                scriptResults.failures++
            }
        }
    }

    // Create test cases using OASys assessment data
    if (testParams.assessmentCount != null) {

        const oasysSetData = await getTestData(testParams.assessmentCount, testParams.whereClause)
        
        for (const assessment of oasysSetData) {
            scriptResults.cases++
            const errorLog: string[] = []
            try {
                const testCaseParams = createTestCase(assessment)
                errorLog.push(`    Input parameters: ${JSON.stringify(testCaseParams)}`)

                let expectedTestCaseValues = ''
                if (testParams.expectedResultsFile == null) {
                    const functionCall = getFunctionCall(testCaseParams)
                    errorLog.push(`    Oracle call:    ${JSON.stringify(functionCall)}`)
                    expectedTestCaseValues = await getOgrsResult(functionCall)
                    errorLog.push(`    Oracle  results:   ${expectedTestCaseValues}`)
                }

                const expectedTestCaseResult = loadExpectedValues(expectedTestCaseValues.split('|'))
                errorLog.push(`    Oracle  result object:   ${JSON.stringify(expectedTestCaseResult)}`)

                const testCaseResult = calculateTestCase(testCaseParams, expectedTestCaseResult, assessment.assessmentPk.toString(), testParams)
                scriptResults.testCaseResults.push(testCaseResult)
                if (testCaseResult.failed) {
                    scriptResults.failures++
                }
            } catch (e) {
                const logText: string[] = ['']
                logText.push(`Test case ${assessment.assessmentPk.toString()}  ERROR`)
                logText.push(`    Error:   ${e}`)
                errorLog.forEach((line) => logText.push(line))
                scriptResults.testCaseResults.push({
                    logText: logText,
                    outputParams: null,
                    failed: true,
                })
                scriptResults.failures++
            }
        }
    }

    return scriptResults
}

function getFunctionCall(params: TestCaseParameters): string {

    let result: string[] = []

    result.push(`eor.new_gen_predictors_pkg.get_ogrs4('${params.STATIC_CALC}'`)
    result.push(dateParameterToString(params.DOB))
    result.push(stringParameterToString(params.GENDER))
    result.push(stringParameterToString(params.OFFENCE_CODE))
    result.push(params.TOTAL_SANCTIONS_COUNT?.toString() ?? 'null')
    result.push(params.TOTAL_VIOLENT_SANCTIONS?.toString() ?? 'null')
    result.push(params.CONTACT_ADULT_SANCTIONS?.toString() ?? 'null')
    result.push(params.CONTACT_CHILD_SANCTIONS?.toString() ?? 'null')
    result.push(params.INDECENT_IMAGE_SANCTIONS?.toString() ?? 'null')
    result.push(params.PARAPHILIA_SANCTIONS?.toString() ?? 'null')
    result.push(stringParameterToString(params.STRANGER_VICTIM))
    result.push(params.AGE_AT_FIRST_SANCTION?.toString() ?? 'null')
    result.push(dateParameterToString(params.LAST_SANCTION_DATE))
    result.push(dateParameterToString(params.DATE_RECENT_SEXUAL_OFFENCE))
    result.push(stringParameterToString(params.CURR_SEX_OFF_MOTIVATION))
    result.push(dateParameterToString(params.MOST_RECENT_OFFENCE))
    result.push(dateParameterToString(params.COMMUNITY_DATE))
    result.push(stringParameterToString(params.ONE_POINT_THIRTY))
    result.push(params.TWO_POINT_TWO?.toString() ?? 'null')
    result.push(params.THREE_POINT_FOUR?.toString() ?? 'null')
    result.push(params.FOUR_POINT_TWO?.toString() ?? 'null')
    result.push(params.SIX_POINT_FOUR?.toString() ?? 'null')
    result.push(params.SIX_POINT_SEVEN?.toString() ?? 'null')
    result.push(params.SIX_POINT_EIGHT?.toString() ?? 'null')
    result.push(params.SEVEN_POINT_TWO?.toString() ?? 'null')
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
    result.push(params.EIGHT_POINT_EIGHT?.toString() ?? 'null')
    result.push(params.NINE_POINT_ONE?.toString() ?? 'null')
    result.push(params.NINE_POINT_TWO?.toString() ?? 'null')
    result.push(params.ELEVEN_POINT_TWO?.toString() ?? 'null')
    result.push(params.ELEVEN_POINT_FOUR?.toString() ?? 'null')
    result.push(params.TWELVE_POINT_ONE?.toString() ?? 'null')
    result.push(params.OGRS4G_ALGO_VERSION?.toString() ?? 'null')
    result.push(params.OGRS4V_ALGO_VERSION?.toString() ?? 'null')
    result.push(params.OGP2_ALGO_VERSION?.toString() ?? 'null')
    result.push(params.OVP2_ALGO_VERSION?.toString() ?? 'null')
    result.push(params.OSP_ALGO_VERSION?.toString() ?? 'null')
    result.push(params.SNSV_ALGO_VERSION?.toString() ?? 'null')
    result.push(params.AGGRAVATED_BURGLARY?.toString() ?? 'null')
    result.push(params.ARSON?.toString() ?? 'null')
    result.push(params.CRIMINAL_DAMAGE_LIFE?.toString() ?? 'null')
    result.push(params.FIREARMS?.toString() ?? 'null')
    result.push(params.GBH?.toString() ?? 'null')
    result.push(params.HOMICIDE?.toString() ?? 'null')
    result.push(params.KIDNAP?.toString() ?? 'null')
    result.push(params.ROBBERY?.toString() ?? 'null')
    result.push(params.WEAPONS_NOT_FIREARMS?.toString() ?? 'null')
    result.push(`${stringParameterToString(params.CUSTODY_IND)})`)

    return result.join(',')
}

function dateParameterToString(param: Dayjs): string {

    const result = param?.format('DD-MM-YYYY')
    return result == 'Invalid Date' || result == null ? 'null' : `to_date('${result}','DD-MM-YYYY')`
}

function stringParameterToString(param: string): string {

    return param == null ? 'null' : `'${param}'`
}