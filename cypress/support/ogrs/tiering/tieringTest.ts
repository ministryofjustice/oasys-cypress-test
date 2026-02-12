import { TieringTestParameters, TieringTestResult } from '../../../../oasys/ogrs/types'
import * as db from '../../data/oasysDb'
import { getTieringTestData } from './getTieringData'
import { testTieringCase, testTieringCaseNew } from './tieringTestCase'

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

        // // Original process
        // const caseResult = testTieringCase(tieringCase, logText)

        // if (caseResult != tieringCase.finalTier) {
        //     result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn} FAILED`)
        //     result.logText.push(`     ${JSON.stringify(tieringCase)}`)
        //     result.logText.push(`     ROSH: ${tieringCase.rosh}`)
        //     result.logText.push(`     MAPPA: ${tieringCase.mappa}`)
        //     result.logText.push(`     Lifer: ${tieringCase.lifer}`)
        //     result.logText.push(`     Custody: ${tieringCase.custodyInd}`)
        //     result.logText.push(`     Oracle: ${tieringCase.finalTier}, Cypress: ${caseResult}`)
        //     logText.forEach((log) => {
        //         result.logText.push(log)
        //     })
        //     result.logText.push('')
        //     failed = true
        // }

        // New process
        const caseResult = testTieringCaseNew(tieringCase, logText)

        if (caseResult != tieringCase.finalTier) {
            result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn} FAILED`)
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

        if (failed) {
            result.failed++
        } else {
            result.passed++
        }
    }

    return result
}
