import Decimal from 'decimal.js'

import { ospCoefficients } from './data/ospCoefficients'
import { OutputParameters, ScoreBand, TestCaseParameters } from './types'
import { calculateProbability, checkMissingQuestions, calculateBand, probabilityToPercentage, requiredParams } from './calculateScore'
import { reportScores, addOutputParameter } from './createOutput'

export function ospRsrCalc(params: TestCaseParameters, outputParams: OutputParameters) {

    // Calculate OSP-C, OSP-I and RSR

    let percentageOspC = new Decimal(0)
    let percentageOspI = new Decimal(0)
    // TODO score should be null if A or E
    // OSP-C
    if (params.ONE_POINT_THIRTY == 'N') {
        reportScores(outputParams, 'osp_c', new Decimal(0), null, null, 'A', 0, `''`)
    } else {
        const missing = checkMissingQuestions(params, requiredParams['osp_c'])
        if (params.female) {
            percentageOspC = probabilityToPercentage(ospCoefficients.osp_c.ospFemale)
            if (missing.count > 0) {
                reportScores(outputParams, 'osp_c', null, null, null, 'E', missing.count, missing.result)
            } else {
                reportScores(outputParams, 'osp_c', new Decimal(0), null, null, 'A', 0, `''`)
            }
        } else if (!params.male) {
            if (missing.count > 0) {
                reportScores(outputParams, 'osp_c', null, null, null, 'E', missing.count, `'OSP-DC can't be calculated on gender other than Male.'\n${missing.result}`)
            } else {
                reportScores(outputParams, 'osp_c', new Decimal(0), null, null, 'A', 0, `'OSP-DC can't be calculated on gender other than Male.'`)
            }
        }
        else if (missing.count > 0) {
            reportScores(outputParams, 'osp_c', null, null, null, 'E', missing.count, missing.result)
        } else {
            const contactAdultScore = params.CONTACT_ADULT_SANCTIONS == 0 ? 0 : params.CONTACT_ADULT_SANCTIONS == 1 ? 5 : params.CONTACT_ADULT_SANCTIONS == 2 ? 10 : 15
            const contactChildScore = params.CONTACT_CHILD_SANCTIONS == 0 ? 0 : params.CONTACT_CHILD_SANCTIONS == 1 ? 3 : params.CONTACT_CHILD_SANCTIONS == 2 ? 6 : 9
            const nonContactScore = params.PARAPHILIA_SANCTIONS == 0 ? 0 : params.PARAPHILIA_SANCTIONS == 1 ? 2 : params.PARAPHILIA_SANCTIONS == 2 ? 4 : 6
            const ageScore = (params.age < 18 || params.age > 59) ? 0 : Math.ceil((60 - params.age) / 3)
            const ageAtLastSanctionSexualScore = params.ageAtLastSanctionSexual > 17 ? 10 : params.ageAtLastSanctionSexual > 15 ? 5 : 0
            const previousHistoryScore = params.TOTAL_SANCTIONS_COUNT <= 1 ? 0 : 6
            const contactWithStrangerScore = params.STRANGER_VICTIM == 'Y' ? 4 : 0

            const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore

            // TODO awaiting definitive spec from PH
            // const c = ospCoefficients.osp_c
            // const zScore = c.OSPCIntercept.add(c.OSPCFactor.times(0.5 + (0.5 * totalScore)))

            const c = ospCoefficients.osp_ddc
            const zScore = c.OSPCIntercept.add(c.OSPCFactor.times(totalScore))

            percentageOspC = probabilityToPercentage(calculateProbability(zScore))
            const band = ospBand(params, totalScore)

            addOutputParameter(outputParams, 'osp_c', 'riskReduction', band.reduced)
            reportScores(outputParams, 'osp_c', new Decimal(totalScore), percentageOspC, band.band, 'Y', 0, `''`)
        }
    }

    // OSP-I
    if (params.ONE_POINT_THIRTY == 'N') {
        reportScores(outputParams, 'osp_i', null, null, null, 'A', 0, `''`)
    } else if (params.female) {
        reportScores(outputParams, 'osp_i', null, null, null, 'A', 0, `''`)
    } else {
        const missing = checkMissingQuestions(params, requiredParams['osp_i'])
        if (!params.male) {
            if (missing.count > 0) {
                reportScores(outputParams, 'osp_i', null, null, null, 'E', 0, `'OSP-IIC can't be calculated on gender other than Male.'\n${missing.result}`)
            } else {
                reportScores(outputParams, 'osp_i', null, null, null, 'A', 0, `'OSP-IIC can't be calculated on gender other than Male.'`)
            }
        } else {
            if (missing.count > 0) {
                reportScores(outputParams, 'osp_i', null, null, null, 'E', missing.count, missing.result)
            } else {
                // const c = ospCoefficients.osp_i
                const c = ospCoefficients.osp_iic  // TODO awaiting confirmation from PH that this is the correct algorithm
                const noSanctionsSexualOffences = params.INDECENT_IMAGE_SANCTIONS + params.CONTACT_CHILD_SANCTIONS + params.PARAPHILIA_SANCTIONS == 0
                const twoPlusIIOC = params.INDECENT_IMAGE_SANCTIONS > 1
                const oneIIOC = params.INDECENT_IMAGE_SANCTIONS == 1
                const twoPlusChildContact = params.CONTACT_CHILD_SANCTIONS > 1
                const oneChildContact = params.CONTACT_CHILD_SANCTIONS == 1

                const probabilityOspI = (params.female ? c.OSPIFemale : noSanctionsSexualOffences ? c.OSPINoSanctions : twoPlusIIOC ? c.OSPITwoPlusIIOC :
                    oneIIOC ? c.OSPIOneIIOC : twoPlusChildContact ? c.OSPITwoPlusChildContact : oneChildContact ? c.OSPIOneChildContact : c.OSPIOthers)

                const band: ScoreBand = params.female || noSanctionsSexualOffences ? 'N/A' : twoPlusIIOC ? 'High' : oneIIOC ? 'Medium' : 'Low'
                percentageOspI = probabilityToPercentage(probabilityOspI)

                reportScores(outputParams, 'osp_i', null, percentageOspI, band, 'Y', 0, `''`)
            }
        }
    }

    // RSR
    if (!params.male && !params.female) {
        reportScores(outputParams, 'rsr', null, null, null, 'E', 0, `'RSR can't be calculated on gender other than Male and Female.'`)
        return null
    } else if (outputParams.SNSV_MISSING_COUNT_STATIC > 0) {
        if (params.STATIC_CALC == 'Y') {
            reportScores(outputParams, 'rsr', null, null, null, 'E', outputParams.SNSV_MISSING_COUNT_STATIC, outputParams.SNSV_MISSING_QUESTIONS_STATIC)
        } else {
            reportScores(outputParams, 'rsr', null, null, null, 'E', outputParams.SNSV_MISSING_COUNT_DYNAMIC, outputParams.SNSV_MISSING_QUESTIONS_DYNAMIC)
        }
        addOutputParameter(outputParams, 'rsr', 'dynamic', 'N')
    } else {
        let percentageRsr = outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? outputParams.SNSV_PERCENTAGE_DYNAMIC : outputParams.SNSV_PERCENTAGE_STATIC
        percentageRsr = percentageRsr?.add(percentageOspC).add(percentageOspI) ?? null

        const band = calculateBand('rsr', percentageRsr)
        if (params.STATIC_CALC == 'Y') {
            reportScores(outputParams, 'rsr', null, percentageRsr, band, 'Y', 0, `''`)
        } else {
            reportScores(outputParams, 'rsr', null, percentageRsr, band, 'Y', outputParams.SNSV_MISSING_COUNT_DYNAMIC, outputParams.SNSV_MISSING_QUESTIONS_DYNAMIC)
        }
        addOutputParameter(outputParams, 'rsr', 'dynamic', outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'Y' : 'N')
    }

}

function ospBand(params: TestCaseParameters, totalScore: number): { band: ScoreBand, reduced: 'Y' | 'N' } {

    const band: ScoreBand = totalScore < 22 ? 'Low' : totalScore < 30 ? 'Medium' : totalScore < 36 ? 'High' : 'Very High'

    if (band == 'Low' || !params.male || params.CUSTODY_IND == 'Y' || !params.out5Years || params.offenceInLast5Years || params.sexualOffenceInLast5Years) {
        return { band: band, reduced: 'N' }
    }

    return { band: band == 'Very High' ? 'High' : band == 'High' ? 'Medium' : 'Low', reduced: 'Y' }
}
