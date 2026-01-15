import { TieringTestParameters, TieringTestResult } from '../types'
import * as db from '../../oasysDb'
import { getTieringTestData } from './getTieringData'
import { testTieringCase } from './tieringTestCase'

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

        const caseResult = testTieringCase(tieringCase, logText)

        if (caseResult != tieringCase.finalTier) {
            result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn}: FAILED`)
            result.logText.push(`     ${JSON.stringify(tieringCase)}`)
            result.logText.push(`     ROSH: ${tieringCase.rosh}`)
            result.logText.push(`     MAPPA: ${tieringCase.mappa}`)
            result.logText.push(`     Lifer: ${tieringCase.lifer}`)
            result.logText.push(`     Oracle: ${tieringCase.finalTier}, Cypress: ${caseResult}`)
            logText.forEach((log) => {
                result.logText.push(log)
            })
            result.failed++
        } else {
            //result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn}`)
            result.passed++
        }
    }


    return result
}
