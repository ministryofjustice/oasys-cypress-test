import { TieringTestParameters, TieringTestResult } from '../../../../oasys/lib/ogrs/types'
import * as db from '../../oasysDb'
import { getTieringTestData } from './getTieringData'
import { testTieringCase, testTieringCaseAlternative } from './tieringTestCase'

export const dateFormat = 'DD-MM-YYYY'

export async function tieringTest(testParams: TieringTestParameters): Promise<TieringTestResult> {

    const result: TieringTestResult = {
        logText: [],
        failed: 0,
        passed: 0,
    }

    const tieringData = await getTieringTestData(testParams.count, testParams.whereClause)

    for (const tieringCase of tieringData) {
        const logText: string[] = []
        const logTextAlternative: string[] = []
        let failed = false

        // Original process
        const caseResult = testTieringCase(tieringCase, logText)

        if (caseResult != tieringCase.finalTier) {
            result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn}: Original process FAILED`)
            result.logText.push(`     ${JSON.stringify(tieringCase)}`)
            result.logText.push(`     ROSH: ${tieringCase.rosh}`)
            result.logText.push(`     MAPPA: ${tieringCase.mappa}`)
            result.logText.push(`     Lifer: ${tieringCase.lifer}`)
            result.logText.push(`     Custody: ${tieringCase.custodyInd}`)
            result.logText.push(`     Oracle: ${tieringCase.finalTier}, Cypress: ${caseResult}`)
            logText.forEach((log) => {
                result.logText.push(log)
            })
            result.logText.push('')
            failed = true
        }

        // Alternative process
        const caseResultAlternative = testTieringCaseAlternative(tieringCase, logTextAlternative)

        if (caseResultAlternative != tieringCase.alternativeTier) {
            result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn}: Alternative process FAILED`)
            result.logText.push(`     ${JSON.stringify(tieringCase)}`)
            result.logText.push(`     ROSH: ${tieringCase.rosh}`)
            result.logText.push(`     MAPPA: ${tieringCase.mappa}`)
            result.logText.push(`     Lifer: ${tieringCase.lifer}`)
            result.logText.push(`     Custody: ${tieringCase.custodyInd}`)
            result.logText.push(`     Oracle: ${tieringCase.alternativeTier}, Cypress: ${caseResultAlternative}`)
            logTextAlternative.forEach((log) => {
                result.logText.push(log)
            })
            result.logText.push('')
            failed = true
        }

        if (failed) {
            result.failed++
        } else {
            result.passed++
        }
    }

    return result
}
