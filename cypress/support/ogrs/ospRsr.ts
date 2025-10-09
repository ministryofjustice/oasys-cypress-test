import Decimal from 'decimal.js'

import { ospCoefficients } from './data/ospCoefficients'
import { OutputParameters, ScoreBand, TestCaseParameters } from './types'
import { calculateProbability, checkMissingQuestions, calculateBand, probabilityToPercentage, requiredParams } from './calculateScore'
import { reportScores, addOutputParameter } from './createOutput'

export function ospRsrCalc(params: TestCaseParameters, outputParams: OutputParameters, snsvBProbability: Decimal, snsvEProbability: Decimal) {

    // Calculate OSP-C, OSP-I and RSR

    let probabilityOspC = new Decimal(0)
    let probabilityOspI = new Decimal(0)

    // OSP-C
    if (params.ONE_POINT_THIRTY == 'N') {
        reportScores(outputParams, 'osp_c', new Decimal(0), new Decimal(0), null, 'A', 0, null)
    } else if (!params.male) {
        reportScores(outputParams, 'osp_c', new Decimal(0), new Decimal(0), null, 'A', 0, `OSP-DC can't be calculated on gender other than Male.`)
        if (params.female) {
            probabilityOspC = ospCoefficients.osp_c.ospFemale
        }
    } else {
        const missing = checkMissingQuestions(params, requiredParams['osp_c'])
        if (missing.count > 0) {
            reportScores(outputParams, 'osp_c', null, null, null, 'E', missing.count, missing.result)
        } else {
            const c = ospCoefficients.osp_c
            const contactAdultScore = params.CONTACT_ADULT_SANCTIONS == 0 ? 0 : params.CONTACT_ADULT_SANCTIONS == 1 ? 5 : params.CONTACT_ADULT_SANCTIONS == 2 ? 10 : 15
            const contactChildScore = params.CONTACT_CHILD_SANCTIONS == 0 ? 0 : params.CONTACT_CHILD_SANCTIONS == 1 ? 3 : params.CONTACT_CHILD_SANCTIONS == 2 ? 6 : 9
            const nonContactScore = params.PARAPHILIA_SANCTIONS == 0 ? 0 : params.PARAPHILIA_SANCTIONS == 1 ? 2 : params.PARAPHILIA_SANCTIONS == 2 ? 4 : 6
            const ageScore = (params.age < 18 || params.age > 59) ? 0 : Math.ceil((60 - params.age) / 3)
            const ageAtLastSanctionSexualScore = params.ageAtLastSanctionSexual > 17 ? 10 : params.ageAtLastSanctionSexual > 15 ? 5 : 0
            const previousHistoryScore = params.TOTAL_SANCTIONS_COUNT <= 1 ? 0 : 6
            const contactWithStrangerScore = params.STRANGER_VICTIM == 'Y' ? 4 : 0

            const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore
            const zScore = c.OSPCIntercept.add(c.OSPCFactor.times(0.5 + (0.5 * totalScore)))

            probabilityOspC = calculateProbability(zScore)
            const band = ospBand(params, totalScore)

            addOutputParameter(outputParams, 'osp_c', 'riskReduction', band.reduced)
            reportScores(outputParams, 'osp_c', new Decimal(totalScore), probabilityToPercentage(probabilityOspC), band.band, 'Y', 0, `''`)
        }
    }

    // OSP-I
    if (params.ONE_POINT_THIRTY == 'N') {
        reportScores(outputParams, 'osp_i', null, new Decimal(0), null, 'A', 0, null)
    } else if (!params.male) {
        reportScores(outputParams, 'osp_i', null, new Decimal(0), null, 'A', 0, `OSP-IIC can't be calculated on gender other than Male.`)
    } else {
        const missing = checkMissingQuestions(params, requiredParams['osp_i'])
        if (missing.count > 0) {
            reportScores(outputParams, 'osp_i', null, null, null, 'E', missing.count, missing.result)
        } else {
            const c = ospCoefficients.osp_i
            const noSanctionsSexualOffences = params.INDECENT_IMAGE_SANCTIONS + params.CONTACT_CHILD_SANCTIONS + params.PARAPHILIA_SANCTIONS == 0
            const twoPlusIIOC = params.INDECENT_IMAGE_SANCTIONS > 1
            const oneIIOC = params.INDECENT_IMAGE_SANCTIONS == 1
            const twoPlusChildContact = params.CONTACT_CHILD_SANCTIONS > 1
            const oneChildContact = params.CONTACT_CHILD_SANCTIONS == 1

            probabilityOspI = (params.female ? c.OSPIFemale : noSanctionsSexualOffences ? c.OSPINoSanctions : twoPlusIIOC ? c.OSPITwoPlusIIOC :
                oneIIOC ? c.OSPIOneIIOC : twoPlusChildContact ? c.OSPITwoPlusChildContact : oneChildContact ? c.OSPIOneChildContact : c.OSPIOthers)

            const band: ScoreBand = params.female || noSanctionsSexualOffences ? 'N/A' : twoPlusIIOC ? 'High' : oneIIOC ? 'Medium' : 'Low'

            reportScores(outputParams, 'osp_i', null, probabilityToPercentage(probabilityOspI), band, 'Y', 0, `''`)
        }
    }

    // RSR
    if (!params.male && !params.female) {
        reportScores(outputParams, 'rsr', null, null, null, 'A', 0, `RSR can't be calculated on gender other than Male and Female.`)
        return null
    } else {
        const dynamic = outputParams.SNSV_CALCULATED_DYNAMIC == 'Y'
        const missing = checkMissingQuestions(params, requiredParams[dynamic ? 'serious_violence_extended' : 'serious_violence_brief'])
        if (missing.count > 0) {
            reportScores(outputParams, 'rsr', null, null, null, 'E', missing.count, missing.result)
        } else {
            const probabilityRsr = dynamic ? snsvEProbability : snsvBProbability
            const percentageRsr = probabilityToPercentage(probabilityRsr?.add(probabilityOspC).add(probabilityOspI) ?? null)

            const band = calculateBand('rsr', percentageRsr)
            reportScores(outputParams, 'rsr', null, percentageRsr, band, 'Y', 0, `''`)
            addOutputParameter(outputParams, 'rsr', 'dynamic', outputParams.SNSV_CALCULATED_DYNAMIC)
        }
    }
}

function ospBand(params: TestCaseParameters, totalScore: number): { band: ScoreBand, reduced: 'Y' | 'N' } {

    const band: ScoreBand = totalScore < 22 ? 'Low' : totalScore < 30 ? 'Medium' : totalScore < 36 ? 'High' : 'Very High'

    if (band == 'Low' || !params.male || params.CUSTODY_IND == 'Y' || !params.out5Years || params.offenceInLast5Years || params.sexualOffenceInLast5Years) {
        return { band: band, reduced: 'N' }
    }

    return { band: band == 'Very High' ? 'High' : band == 'High' ? 'Medium' : 'Low', reduced: 'Y' }
}
