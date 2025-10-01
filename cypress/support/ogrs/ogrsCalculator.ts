import { Decimal } from 'decimal.js'

import { TestCaseParameters, TestCaseResult, ExpectedScores, CalculationResult, ScoreType, OutputParameters } from './types'
import { calculate } from './calculateScore'
import { ospCCalc, ospICalc } from './osp'
import { rsrCalc } from './rsr'
import { createOutputObject } from './createOutput'


export function calculateAssessment(params: TestCaseParameters, expectedValues: ExpectedScores, toleranceParam: string, testCaseRef: string): TestCaseResult {

    Decimal.set({ precision: 40 })

    const results: TestCaseResult = {
        serious_violence_brief: null,
        serious_violence_extended: null,
        general_brief: null,
        violence_brief: null,
        general_extended: null,
        violence_extended: null,
        osp_c: null,
        osp_i: null,
        rsr: null,
        logText: [],
        failed: false,
        outputParams: createOutputObject(),
    }
    const tolerance = new Decimal(toleranceParam)

    const snsvEResult = calculate('serious_violence_extended', params, results.outputParams)
    const generalEResult = calculate('general_extended', params, results.outputParams)
    const violenceEResult = calculate('violence_extended', params, results.outputParams)
    const snsvBResult = calculate('serious_violence_brief', params, results.outputParams, snsvEResult.status == 'Y')
    const generalBResult = calculate('general_brief', params, results.outputParams, generalEResult.status == 'Y')
    const violenceBResult = calculate('violence_brief', params, results.outputParams, violenceEResult.status == 'Y')
    const ospCResult = ospCCalc(params, results.outputParams)
    const ospIResult = ospICalc(params, results.outputParams)
    const rsrResult = rsrCalc(params, snsvBResult, snsvEResult, ospCResult, ospIResult, results.outputParams)

    results.logText.push('')
    results.logText.push(`Test case ${testCaseRef}`)
    results.logText.push(`      Parameters:      ${JSON.stringify(params)}`)
    results.logText.push(`      Expected output: ${JSON.stringify(expectedValues.outputParameters)}`)
    results.logText.push(`      Cypress output:  ${JSON.stringify(results.outputParams)}`)

    checkResult('serious_violence_extended', snsvEResult, results, expectedValues, tolerance)
    checkResult('general_extended', generalEResult, results, expectedValues, tolerance)
    checkResult('violence_extended', violenceEResult, results, expectedValues, tolerance)
    checkResult('serious_violence_brief', snsvBResult, results, expectedValues, tolerance)
    checkResult('general_brief', generalBResult, results, expectedValues, tolerance)
    checkResult('violence_brief', violenceBResult, results, expectedValues, tolerance)
    checkResult('osp_c', ospCResult, results, expectedValues, tolerance)
    checkResult('osp_i', ospIResult, results, expectedValues, tolerance)
    checkResult('rsr', rsrResult, results, expectedValues, tolerance)

    return results
}


function checkResult(scoreType: ScoreType, calculationResult: CalculationResult, testCaseResults: TestCaseResult, expectedScores: ExpectedScores, tolerance: Decimal) {

    const expectedScore = expectedScores[scoreType]

    const zDiff = (calculationResult.zScore == null || expectedScore.zScore == null) ? null : expectedScore.zScore.minus(calculationResult.zScore).abs()
    const pDiff = (calculationResult.probability == null || expectedScore.probability == null) ? null : Math.abs(expectedScore.probability - calculationResult.probability)

    testCaseResults[scoreType] = {
        zScore: calculationResult.zScore,
        probability: calculationResult.probability,
        band: calculationResult.band,
        logText: [],
        zDiff: zDiff,
        pDiff: pDiff,
        failed: false,
    }

    // zScore
    if (calculationResult.zScore == null || expectedScore.zScore == null) {
        if (calculationResult.zScore != expectedScore.zScore) {
            testCaseResults[scoreType].failed = true
        }
    } else {
        if (zDiff.greaterThan(tolerance)) {
            testCaseResults[scoreType].failed = true
        }
    }

    // Probability
    if (calculationResult.probability == null || expectedScore.probability == null) {
        if (calculationResult.probability != expectedScore.probability) {
            testCaseResults[scoreType].failed = true
        }
    } else {
        if (pDiff > 0) {
            testCaseResults[scoreType].failed = true
        }
    }

    // Band
    if (calculationResult.band != expectedScore.band) {
        testCaseResults[scoreType].failed = true
    }

    testCaseResults.logText.push('')
    testCaseResults.logText.push(`  ${scoreType} ${testCaseResults[scoreType].failed ? '*** FAILED ***' : ''}`)
    testCaseResults.logText.push(`    zScore -      Expected: ${expectedScore.zScore}, actual: ${testCaseResults[scoreType].zScore}, difference: ${zDiff}`)
    testCaseResults.logText.push(`    Probability - Expected: ${expectedScore.probability}, actual: ${testCaseResults[scoreType].probability}, difference: ${pDiff}`)
    testCaseResults.logText.push(`    Band -        Expected: ${expectedScore.band}, actual: ${testCaseResults[scoreType].band}`)

    if (testCaseResults[scoreType].failed) {
        testCaseResults.failed = true
    }

}


export const requiredParams = {

    serious_violence_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'offenceCat',
    ],
    serious_violence_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'TWO_POINT_TWO',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
        'AGGRAVATED_BURGLARY',
        'ARSON',
        'CRIMINAL_DAMAGE_LIFE',
        'FIREARMS',
        'GBH',
        'HOMICIDE',
        'KIDNAP',
        'ROBBERY',
        'WEAPONS_NOT_FIREARMS',
        'offenceCat',
    ],
    general_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'offenceCat',
    ],
    violence_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'offenceCat',
    ],
    general_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'SEVEN_POINT_TWO',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'TWELVE_POINT_ONE',
        'DAILY_DRUG_USER',
        'AMPHETAMINES',
        'BENZODIAZIPINES',
        'CANNABIS',
        'CRACK_COCAINE',
        'ECSTASY',
        'HALLUCINOGENS',
        'HEROIN',
        'KETAMINE',
        'METHADONE',
        'MISUSED_PRESCRIBED',
        'OTHER_DRUGS',
        'OTHER_OPIATE',
        'POWDER_COCAINE',
        'SOLVENTS',
        'SPICE',
        'STEROIDS',
        'EIGHT_POINT_EIGHT',
        'offenceCat',
    ],
    violence_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'TWO_POINT_TWO',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
        'EIGHT_POINT_EIGHT',
        'offenceCat',
    ],
    osp_c: [
        'DOB',
        'TOTAL_SANCTIONS_COUNT',
        'CONTACT_ADULT_SANCTIONS',
        'CONTACT_CHILD_SANCTIONS',
        'INDECENT_IMAGE_SANCTIONS',
        'PARAPHILIA_SANCTIONS',
        'STRANGER_VICTIM',
        'DATE_RECENT_SEXUAL_OFFENCE',

    ],
    osp_i: [
        'GENDER',
        'CONTACT_CHILD_SANCTIONS',
        'INDECENT_IMAGE_SANCTIONS',
        'ONE_POINT_THIRTY',
    ],
}