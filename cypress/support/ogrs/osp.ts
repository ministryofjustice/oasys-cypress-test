import { ospCoefficients } from './data/ospCoefficients'
import { CalculationResult, OutputParameters, ScoreBand, TestCaseParameters } from './types'
import { calculateProbability, validateParameters, reportScores } from './calculateScore'
import { requiredParams } from './ogrsCalculator'
import { addOutputParameter } from './createOutput'

export function ospCCalc(params: TestCaseParameters, outputParams: OutputParameters): CalculationResult {

    // TODO most recent offence and custody ind
    // TODO bands/probability

    const missing = validateParameters(params, requiredParams['osp_c'])
    if (missing.length > 0) {
        reportScores(outputParams, 'osp_c', null, null, null, 'E', missing)
        return { zScore: null, probability: null, band: null, status: 'E' }
    }

    const c = ospCoefficients.osp_c

    if (params.female) {
        const probability = c.ospFemale.times(10000).round().div(100).toNumber()
        reportScores(outputParams, 'osp_c', null, probability, 'N/A', 'N', [])
        return { zScore: null, probability: null, band: 'N/A', status: 'N' }
    }

    const contactAdultScore = params.CONTACT_ADULT_SANCTIONS == 0 ? 0 : params.CONTACT_ADULT_SANCTIONS == 1 ? 5 : params.CONTACT_ADULT_SANCTIONS == 2 ? 10 : 15
    const contactChildScore = params.CONTACT_CHILD_SANCTIONS == 0 ? 0 : params.CONTACT_CHILD_SANCTIONS == 1 ? 3 : params.CONTACT_CHILD_SANCTIONS == 2 ? 6 : 9
    const nonContactScore = params.PARAPHILIA_SANCTIONS == 0 ? 0 : params.PARAPHILIA_SANCTIONS == 1 ? 2 : params.PARAPHILIA_SANCTIONS == 2 ? 4 : 6
    const ageScore = (params.age < 18 || params.age > 59) ? 0 : Math.ceil((60 - params.age) / 3)
    const ageAtLastSanctionSexualScore = params.ageAtLastSanctionSexual > 17 ? 10 : params.ageAtLastSanctionSexual > 15 ? 5 : 0
    const previousHistoryScore = params.TOTAL_SANCTIONS_COUNT <= 1 ? 0 : 6
    const contactWithStrangerScore = params.STRANGER_VICTIM == 'Y' ? 4 : 0

    const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore
    const zScore = c.OSPCYear2Intercept.add(c.OSPCYear2Factor.times(0.5 + (0.5 * totalScore)))

    const probability = calculateProbability(zScore)

    const band = ospBand(params, totalScore)

    addOutputParameter(outputParams, 'osp_c', 'riskReduction', band.reduced)
    reportScores(outputParams, 'osp_c', zScore, probability, band.band, 'Y', [])
    return { zScore: zScore, probability: probability, band: band.band, status: 'Y' }
}

export function ospICalc(params: TestCaseParameters, outputParams: OutputParameters): CalculationResult {

    const missing = validateParameters(params, requiredParams['osp_i'])
    if (missing.length > 0) {
        reportScores(outputParams, 'osp_i', null, null, null, 'E', missing)
        return { zScore: null, probability: null, band: null, status: 'E' }
    }

    const c = ospCoefficients.osp_i

    const noSanctionsSexualOffences = params.ONE_POINT_THIRTY != 'Y'
    const twoPlusIIOC = params.INDECENT_IMAGE_SANCTIONS > 1
    const oneIIOC = params.INDECENT_IMAGE_SANCTIONS == 1
    const twoPlusChildContact = params.CONTACT_CHILD_SANCTIONS > 1
    const oneChildContact = params.CONTACT_CHILD_SANCTIONS == 1

    const probability = (params.female ? c.OSPI2Female : noSanctionsSexualOffences ? c.OSPI2NoSanctions : twoPlusIIOC ? c.OSPI2TwoPlusIIOC :
        oneIIOC ? c.OSPI2OneIIOC : twoPlusChildContact ? c.OSPI2TwoPlusChildContact : oneChildContact ? c.OSPI2OneChildContact : c.OSPI2Others)
        .times(10000).round().div(100).toNumber()

    const band: ScoreBand = params.female || noSanctionsSexualOffences ? 'N/A' : twoPlusIIOC ? 'High' : oneIIOC ? 'Medium' : 'Low'

    reportScores(outputParams, 'osp_i', null, probability, band, 'Y', [])
    return { zScore: null, probability: probability, band: band, status: 'Y' }
}

function ospBand(params: TestCaseParameters, totalScore: number): { band: ScoreBand, reduced: 'Y' | 'N' } {

    const band: ScoreBand = totalScore < 22 ? 'Low' : totalScore < 30 ? 'Medium' : totalScore < 36 ? 'High' : 'Very High'

    if (band == 'Low' || !params.male || params.CUSTODY_IND == 'Y' || !params.out5Years || params.offenceInLast5Years || params.sexualOffenceInLast5Years) {
        return { band: band, reduced: 'N' }
    }

    return { band: band == 'Very High' ? 'High' : band == 'High' ? 'Medium' : 'Low', reduced: 'Y' }
}