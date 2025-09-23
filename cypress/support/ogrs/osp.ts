import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function ospCCalc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    const logText: string[] = []
    const c = coefficients.OSPC

    let score = 0

    const contactAdultScore = inputs.contactAdultCount == 0 ? 0 : inputs.contactAdultCount == 1 ? 5 : inputs.contactAdultCount == 2 ? 10 : 15
    const contactChildScore = inputs.contactChildCount == 0 ? 0 : inputs.contactChildCount == 1 ? 3 : inputs.contactChildCount == 2 ? 6 : 9
    const nonContactScore = inputs.nonContactCount == 0 ? 0 : inputs.nonContactCount == 1 ? 2 : inputs.nonContactCount == 2 ? 4 : 6
    const ageScore = (calculatedInputs.age < 18 || calculatedInputs.age > 59) ? 0 : Math.ceil((60 - calculatedInputs.age) / 3)
    const ageAtLastSanctionSexualScore = calculatedInputs.ageAtLastSanctionSexual > 17 ? 10 : calculatedInputs.ageAtLastSanctionSexual > 15 ? 5 : 0
    const previousHistoryScore = inputs.sanctionCount <= 1 ? 0 : 6
    const contactWithStrangerScore = inputs.contactWithStranger == 'Y' ? 4 : 0

    logText.push(`contactAdultScore: ${contactAdultScore}`)
    logText.push(`contactChildScore: ${contactChildScore}`)
    logText.push(`nonContactScore: ${nonContactScore}`)
    logText.push(`ageScore: ${ageScore}`)
    logText.push(`ageAtLastSanctionSexualScore: ${ageAtLastSanctionSexualScore}`)
    logText.push(`previousHistoryScore: ${previousHistoryScore}`)
    logText.push(`contactWithStrangerScore: ${contactWithStrangerScore}`)

    const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore
    const resultYear1 = c.OSPCYear1Intercept.plus(c.OSPCYear1Factor.times(0.5 + (0.5 * totalScore)))
    const resultYear2 = c.OSPCYear2Intercept.plus(c.OSPCYear2Factor.times(0.5 + (0.5 * totalScore)))

    const diffYear1 = new Decimal(inputs.expectedResults.ospCYear1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.ospCYear2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}

export function ospICalc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    const logText: string[] = []
    const c = coefficients.OSPI

    const female = inputs.gender == 'F'
    const noSanctionsSexualOffences = inputs.everCommittedSexualOffence != 'Y'
    const twoPlusIIOC = inputs.childImageCount > 1
    const oneIIOC = inputs.childImageCount == 1
    const twoPlusChildContact = inputs.contactChildCount > 1
    const oneChildContact = inputs.contactChildCount == 1

    logText.push(`female: ${female}`)
    logText.push(`noSanctionsSexualOffences: ${noSanctionsSexualOffences}`)
    logText.push(`twoPlusIIOC: ${twoPlusIIOC}`)
    logText.push(`oneIIOC: ${oneIIOC}`)
    logText.push(`twoPlusChildContact: ${twoPlusChildContact}`)
    logText.push(`oneChildContact: ${oneChildContact}`)

    const resultYear1 = female ? c.OSPI1Female : noSanctionsSexualOffences ? c.OSPI1NoSanctions : twoPlusIIOC ? c.OSPI1TwoPlusIIOC :
        oneIIOC ? c.OSPI1OneIIOC : twoPlusChildContact ? c.OSPI1TwoPlusChildContact : oneChildContact ? c.OSPI1OneChildContact : c.OSPI1Others

    const resultYear2 = female ? c.OSPI2Female : noSanctionsSexualOffences ? c.OSPI2NoSanctions : twoPlusIIOC ? c.OSPI2TwoPlusIIOC :
        oneIIOC ? c.OSPI2OneIIOC : twoPlusChildContact ? c.OSPI2TwoPlusChildContact : oneChildContact ? c.OSPI2OneChildContact : c.OSPI2Others

    const diffYear1 = new Decimal(inputs.expectedResults.ospIYear1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.ospIYear2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}