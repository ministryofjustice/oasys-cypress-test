import { createAssessmentTestCase } from 'ogrs/createAssessmentTestCase'
import { TieringTestParameters, TieringTestResult } from '../../../../oasys/ogrs/types'
import { getOneAssessment } from '../getTestData/getTestData'
import { getTieringTestData } from './getTieringData'
import { testTieringCaseNew } from './tieringTestCase'
import { offences } from '../../data/oasysDb'
import { appVersions } from 'lib/dateTime'
import { getResult } from 'lib/ogrs'

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

        const caseResult = testTieringCaseNew(tieringCase, logText)

        if (caseResult != tieringCase.oracleResults.finalTier) {
            result.logText.push(`CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn} FAILED`)
            result.logText.push(`     ${JSON.stringify(tieringCase)}`)
            result.logText.push(`     ROSH: ${tieringCase.rosh}`)
            result.logText.push(`     MAPPA: ${tieringCase.mappa}`)
            result.logText.push(`     Lifer: ${tieringCase.lifer}`)
            result.logText.push(`     Custody: ${tieringCase.custodyInd}`)
            result.logText.push(`     Oracle: ${tieringCase.oracleResults.finalTier}, Cypress: ${caseResult}`)
            logText.forEach((log) => {
                result.logText.push(log)
            })
            result.logText.push('')
            failed = true
        }

        if (testParams.checkOgrs4) {

            const ogrs4LogText: string[] = []

            const ogrsAssessment = await getOneAssessment(tieringCase.assessmentPk)
            const ogrsParams = createAssessmentTestCase(ogrsAssessment, offences, appVersions, ogrsAssessment.signedDate)
            const ogrsResult = getResult(ogrsParams)

            let ogrsFailed = checkOgrs4Result('CSRP', ogrsResult.details.RSR_PERCENTAGE?.toNumber(),
                tieringCase.arpCsrp.ncRsrPercentageScore, ogrs4LogText)
            ogrsFailed = checkOgrs4Result('OGRS4G', ogrsResult.details.OGRS4G_PERCENTAGE?.toNumber(),
                tieringCase.arpCsrp.ogrs4gPercentage2yr, ogrs4LogText) || ogrsFailed
            ogrsFailed = checkOgrs4Result('OGP2', ogrsResult.details.OGP2_PERCENTAGE?.toNumber(),
                tieringCase.arpCsrp.ogp2Percentage2yr, ogrs4LogText) || ogrsFailed
            ogrsFailed = checkOgrs4Result('DC-SRP', ogrsResult.details.OSP_DC_PERCENTAGE?.toNumber(),
                tieringCase.srp.ncOspDcPercentageScore, ogrs4LogText) || ogrsFailed
            ogrsFailed = checkOgrs4Result('IIC-SRP ', ogrsResult.details.OSP_IIC_PERCENTAGE?.toNumber(),
                tieringCase.srp.ncOspIicPercentageScore, ogrs4LogText) || ogrsFailed

            if (ogrsFailed) {
                failed = true
                ogrs4LogText.forEach((log) => {
                    result.logText.push(log)
                })
                result.logText.push(JSON.stringify(tieringCase))
                result.logText.push(JSON.stringify(ogrsParams))
                result.logText.push(JSON.stringify(ogrsResult))
                result.logText.push('')
            }
        }

        if (failed) {
            result.failed++
        } else {
            result.passed++
        }
    }

    return result
}

function checkOgrs4Result(desc: string, expect: string | number, actual: string | number, logText: string[]): boolean {

    if (expect != actual) {
        logText.push(`${desc} failed: expected ${expect}, found ${actual}`)
        return true
    }
    return false
}