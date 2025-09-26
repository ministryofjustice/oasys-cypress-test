import { Decimal } from 'decimal.js'

import { TestCaseParameters, ScoreResult, TestCaseResult, ExpectedScores } from './orgsTest'
import { calculate } from './calculateScore'

import { ospCCalc, ospICalc } from './osp'

export type ScoreType = 'serious_violence_brief' | 'serious_violence_extended' | 'general_brief' | 'violence_brief' | 'general_extended' | 'violence_extended' | 'osp_c' | 'osp_i'

export function calculateAssessment(params: TestCaseParameters, expectedValues: ExpectedScores, toleranceParam: string, testCaseRef: string): TestCaseResult {

    Decimal.set({ precision: 40 })

    const results: TestCaseResult = {
        logText: [],
        failed: false,
    }
    const tolerance = new Decimal(toleranceParam)

    results.logText.push('')
    results.logText.push(`Test case ${testCaseRef}`)
    results.logText.push(`    Parameters: ${JSON.stringify(params)}`)
    results.logText.push('')

    // TODO RSR score, rankings, OSP adjustments
    // TODO import and compare intermediate scores?

    const snsvEResult = calculate('serious_violence_extended', params)
    compareAndAddLog('serious_violence_extended', snsvEResult, results, expectedValues, tolerance)

    const generalEResult = calculate('general_extended', params)
    compareAndAddLog('general_extended', generalEResult, results, expectedValues, tolerance)

    const violenceEResult = calculate('violence_extended', params)
    compareAndAddLog('violence_extended', violenceEResult, results, expectedValues, tolerance)

    const snsvBResult: ScoreResult = snsvEResult.zScore == null ? calculate('serious_violence_brief', params)
        : { zScore: null, probability: null, band: null, logText: ['Not calulcated - extended score is available'] }
    compareAndAddLog('serious_violence_brief', snsvBResult, results, expectedValues, tolerance)

    const generalBResult: ScoreResult = generalEResult.zScore == null ? calculate('general_brief', params)
        : { zScore: null, probability: null, band: null, logText: ['Not calulcated - extended score is available'] }
    compareAndAddLog('general_brief', generalBResult, results, expectedValues, tolerance)

    const violenceBResult: ScoreResult = violenceEResult.zScore == null ? calculate('violence_brief', params)
        : { zScore: null, probability: null, band: null, logText: ['Not calulcated - extended score is available'] }
    compareAndAddLog('violence_brief', violenceBResult, results, expectedValues, tolerance)

    compareAndAddLog('osp_c', ospCCalc(params), results, expectedValues, tolerance)
    compareAndAddLog('osp_i', ospICalc(params), results, expectedValues, tolerance)

    return results
}


function compareAndAddLog(scoreType: ScoreType, calculationResult: ScoreResult, testCaseResults: TestCaseResult, expectedScores: ExpectedScores, tolerance: Decimal) {

    calculationResult.failed = true
    const expectedScore = expectedScores[scoreType]

    if (calculationResult.zScore == null) {
        testCaseResults[scoreType] = null
        testCaseResults.logText.push()
        calculationResult.failed = expectedScore.zScore != null
        calculationResult.diff = null
    } else {
        if (expectedScore.zScore == null) {
            calculationResult.diff = null
            calculationResult.failed = true
        } else {
            calculationResult.diff = expectedScore.zScore.minus(calculationResult.zScore).abs()
            calculationResult.failed = calculationResult.diff.greaterThan(tolerance)
            // if (expectedScore.probability.minus(calculationResult.probability).abs().greaterThan(tolerance)) {
            //     calculationResult.failed = true
            // }
        }
        testCaseResults[scoreType] = calculationResult
    }

    if (calculationResult.failed) {
        testCaseResults.logText.push('')
        testCaseResults.logText.push(`    FAIL: ${scoreType} Expected: ${expectedScore.zScore}, actual: ${testCaseResults[scoreType]}, difference: ${calculationResult.diff}`)

        testCaseResults.logText.push('')
        calculationResult.logText.forEach((log) => {
            testCaseResults.logText.push(`        ${log}`)
        })
        testCaseResults.logText.push('')
        testCaseResults.failed = true
    } else {
        testCaseResults.logText.push(`    ${scoreType} Expected: ${expectedScore.zScore}, actual: ${testCaseResults[scoreType]}, difference: ${calculationResult.diff}`)
    }
}
