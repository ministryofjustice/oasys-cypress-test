import { ospCoefficients } from './data/ospCoefficients'
import { ScoreResult, TestCaseParameters } from './orgsTest'

export function ospCCalc(params: TestCaseParameters): ScoreResult {

    // TODO most recent offence and custody ind
    // TODO bands/probability

    const logText: string[] = []
    const c = ospCoefficients.osp_c

    let score = 0

    const contactAdultScore = params.CONTACT_ADULT_SANCTIONS == 0 ? 0 : params.CONTACT_ADULT_SANCTIONS == 1 ? 5 : params.CONTACT_ADULT_SANCTIONS == 2 ? 10 : 15
    const contactChildScore = params.CONTACT_CHILD_SANCTIONS == 0 ? 0 : params.CONTACT_CHILD_SANCTIONS == 1 ? 3 : params.CONTACT_CHILD_SANCTIONS == 2 ? 6 : 9
    const nonContactScore = params.PARAPHILIA_SANCTIONS == 0 ? 0 : params.PARAPHILIA_SANCTIONS == 1 ? 2 : params.PARAPHILIA_SANCTIONS == 2 ? 4 : 6
    const ageScore = (params.age < 18 || params.age > 59) ? 0 : Math.ceil((60 - params.age) / 3)
    const ageAtLastSanctionSexualScore = params.ageAtLastSanctionSexual > 17 ? 10 : params.ageAtLastSanctionSexual > 15 ? 5 : 0
    const previousHistoryScore = params.TOTAL_SANCTIONS_COUNT <= 1 ? 0 : 6
    const contactWithStrangerScore = params.STRANGER_VICTIM == 'Y' ? 4 : 0

    logText.push(`contactAdultScore: ${contactAdultScore}`)
    logText.push(`contactChildScore: ${contactChildScore}`)
    logText.push(`nonContactScore: ${nonContactScore}`)
    logText.push(`ageScore: ${ageScore}`)
    logText.push(`ageAtLastSanctionSexualScore: ${ageAtLastSanctionSexualScore}`)
    logText.push(`previousHistoryScore: ${previousHistoryScore}`)
    logText.push(`contactWithStrangerScore: ${contactWithStrangerScore}`)

    const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore
    const zScore = c.OSPCYear2Intercept.add(c.OSPCYear2Factor.times(0.5 + (0.5 * totalScore)))

    const expZ = zScore.exp()
    return { zScore: zScore, probability: expZ.div(expZ.add(1)), band: null, logText: logText }
}

export function ospICalc(params: TestCaseParameters): ScoreResult {

    const logText: string[] = []
    const c = ospCoefficients.osp_i

    const noSanctionsSexualOffences = params.ONE_POINT_THIRTY != 'Y'
    const twoPlusIIOC = params.INDECENT_IMAGE_SANCTIONS > 1
    const oneIIOC = params.INDECENT_IMAGE_SANCTIONS == 1
    const twoPlusChildContact = params.CONTACT_CHILD_SANCTIONS > 1
    const oneChildContact = params.CONTACT_CHILD_SANCTIONS == 1

    logText.push(`female: ${params.female}`)
    logText.push(`noSanctionsSexualOffences: ${noSanctionsSexualOffences}`)
    logText.push(`twoPlusIIOC: ${twoPlusIIOC}`)
    logText.push(`oneIIOC: ${oneIIOC}`)
    logText.push(`twoPlusChildContact: ${twoPlusChildContact}`)
    logText.push(`oneChildContact: ${oneChildContact}`)

    const zScore = params.female ? c.OSPI2Female : noSanctionsSexualOffences ? c.OSPI2NoSanctions : twoPlusIIOC ? c.OSPI2TwoPlusIIOC :
        oneIIOC ? c.OSPI2OneIIOC : twoPlusChildContact ? c.OSPI2TwoPlusChildContact : oneChildContact ? c.OSPI2OneChildContact : c.OSPI2Others

    const expZ = zScore.exp()
    return { zScore: zScore, probability: expZ.div(expZ.add(1)), band: null, logText: logText }
}