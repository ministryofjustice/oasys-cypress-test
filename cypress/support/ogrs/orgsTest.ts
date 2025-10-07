import * as fs from 'fs-extra'

import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters, TestCaseParameters, TestCaseResult } from './types'
import { calculateTestCase } from './ogrsCalculator'
import { loadParameterSet, loadExpectedValues } from './loadTestData'
import { getOgrsResult } from '../oasysDb'
import { createOutputObject } from './createOutput'

const dataFilePath = './cypress/support/ogrs/data/'
export let dateFormat = ''

export async function ogrsTest(testParams: OgrsTestParameters): Promise<OgrsTestScriptResult> {

    dateFormat = testParams.dateFormat

    const inputParameterFile = await fs.readFile(`${dataFilePath}${testParams.dataFile}.csv`, 'utf8')
    const inputParameters = inputParameterFile.split('\r\n')

    let expectedResults: string[]
    if (testParams.expectedResultsFile != '') {
        const expectedResultsFile = await fs.readFile(`${dataFilePath}${testParams.expectedResultsFile}.csv`, 'utf8')
        expectedResults = expectedResultsFile.split('\n')
    }

    const ogrsTestResults: TestCaseResult[] = []
    let failed = false

    for (let i = testParams.headers ? 1 : 0; i < inputParameters.length; i++) {
        const testCaseParams = loadParameterSet(inputParameters[i])
        let expectedTestCaseValues = ''
        if (testParams.expectedResultsFile == '') {
            expectedTestCaseValues = await getOgrsResult(getFunctionCall(testCaseParams))
        } else {
            expectedTestCaseValues = expectedResults[i]
        }
        const expectedTestCaseResult = loadExpectedValues(expectedTestCaseValues.split(','))
        const testCaseIdentifier = (i + 1).toString()

        const testCaseResult = calculateTestCase(testCaseParams, expectedTestCaseResult, testCaseIdentifier, testParams)
        ogrsTestResults.push(testCaseResult)
        if (testCaseResult.failed) {
            failed = true
        }
    }

    return { testCaseResults: ogrsTestResults, failed: failed }
}

function getFunctionCall(params: TestCaseParameters): string {

    let result: string[] = []

    result.push(`eor.new_gen_predictors_pkg.get_ogrs4('${params.STATIC_CALC}'`)
    result.push(params.DOB.format('DD-MM-YYYY') == 'Invalid Date' ? 'null' : `to_date('${params.DOB.format('DD-MM-YYYY')}','DD-MM-YYYY')`)
    result.push(`'${params.GENDER}'`)
    result.push(`'${params.OFFENCE_CODE}'`)
    result.push(params.TOTAL_SANCTIONS_COUNT.toString())
    result.push(params.TOTAL_VIOLENT_SANCTIONS.toString())
    result.push(params.CONTACT_ADULT_SANCTIONS.toString())
    result.push(params.CONTACT_CHILD_SANCTIONS.toString())
    result.push(params.INDECENT_IMAGE_SANCTIONS.toString())
    result.push(params.PARAPHILIA_SANCTIONS.toString())
    result.push(`'${params.STRANGER_VICTIM}'`)
    result.push(params.AGE_AT_FIRST_SANCTION.toString())
    result.push(params.LAST_SANCTION_DATE.format('DD-MM-YYYY') == 'Invalid Date' ? 'null' : `to_date('${params.LAST_SANCTION_DATE.format('DD-MM-YYYY')}','DD-MM-YYYY')`)
    result.push(params.DATE_RECENT_SEXUAL_OFFENCE.format('DD-MM-YYYY') == 'Invalid Date' ? 'null' : `to_date('${params.DATE_RECENT_SEXUAL_OFFENCE.format('DD-MM-YYYY')}','DD-MM-YYYY')`)
    result.push(params.MOST_RECENT_OFFENCE.format('DD-MM-YYYY') == 'Invalid Date' ? 'null' : `to_date('${params.MOST_RECENT_OFFENCE.format('DD-MM-YYYY')}','DD-MM-YYYY')`)
    result.push(params.COMMUNITY_DATE.format('DD-MM-YYYY') == 'Invalid Date' ? 'null' : `to_date('${params.COMMUNITY_DATE.format('DD-MM-YYYY')}','DD-MM-YYYY')`)
    result.push(`'${params.ONE_POINT_THIRTY}'`)
    result.push(params.TWO_POINT_TWO.toString())
    result.push(params.THREE_POINT_FOUR.toString())
    result.push(params.FOUR_POINT_TWO.toString())
    result.push(params.SIX_POINT_FOUR.toString())
    result.push(params.SIX_POINT_SEVEN.toString())
    result.push(params.SIX_POINT_EIGHT.toString())
    result.push(params.SEVEN_POINT_TWO.toString())
    result.push(`'${params.DAILY_DRUG_USER}'`)
    result.push(`'${params.AMPHETAMINES}'`)
    result.push(`'${params.BENZODIAZIPINES}'`)
    result.push(`'${params.CANNABIS}'`)
    result.push(`'${params.CRACK_COCAINE}'`)
    result.push(`'${params.ECSTASY}'`)
    result.push(`'${params.HALLUCINOGENS}'`)
    result.push(`'${params.HEROIN}'`)
    result.push(`'${params.KETAMINE}'`)
    result.push(`'${params.METHADONE}'`)
    result.push(`'${params.MISUSED_PRESCRIBED}'`)
    result.push(`'${params.OTHER_DRUGS}'`)
    result.push(`'${params.OTHER_OPIATE}'`)
    result.push(`'${params.POWDER_COCAINE}'`)
    result.push(`'${params.SOLVENTS}'`)
    result.push(`'${params.SPICE}'`)
    result.push(`'${params.STEROIDS}'`)
    result.push(params.EIGHT_POINT_EIGHT.toString())
    result.push(params.NINE_POINT_ONE.toString())
    result.push(params.NINE_POINT_TWO.toString())
    result.push(params.ELEVEN_POINT_TWO.toString())
    result.push(params.ELEVEN_POINT_FOUR.toString())
    result.push(params.TWELVE_POINT_ONE.toString())
    result.push(params.OGRS4G_ALGO_VERSION.toString())
    result.push(params.OGRS4V_ALGO_VERSION.toString())
    result.push(params.OGP2_ALGO_VERSION.toString())
    result.push(params.OVP2_ALGO_VERSION.toString())
    result.push(params.OSP_ALGO_VERSION.toString())
    result.push(params.SNSV_ALGO_VERSION.toString())
    result.push(params.AGGRAVATED_BURGLARY.toString())
    result.push(params.ARSON.toString())
    result.push(params.CRIMINAL_DAMAGE_LIFE.toString())
    result.push(params.FIREARMS.toString())
    result.push(params.GBH.toString())
    result.push(params.HOMICIDE.toString())
    result.push(params.KIDNAP.toString())
    result.push(params.ROBBERY.toString())
    result.push(params.WEAPONS_NOT_FIREARMS.toString())
    result.push(`'${params.CUSTODY_IND}')`)

    return result.join(',')
}