import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial2, addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function ovp2Calc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    let result = new Decimal(0)
    const logText: string[] = []
    const c = coefficients.OVP2

    // Age and gender
    if (inputs.gender == 'M') {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.OVP2MaleAAED, c.OVP2MaleAAED2, c.OVP2MaleAAED3, c.OVP2MaleAAED4, result, logText)
    } else {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.OVP2FemaleAAED, c.OVP2FemaleAAED2, c.OVP2FemaleAAED3, c.OVP2FemaleAAED4, result, logText)
        result = addAndReport('Female', c.OVP2Female, result, logText)
    }

    // Offence
    result = addAndReport('Offence', c.offences[inputs.offence], result, logText)

    // Sanctions
    if (inputs.sanctionCount == 1) {
        result = addAndReport('First sanction', c.OVP2FirstSanction, result, logText)
    } else if (inputs.sanctionCount == 2) {
        result = addAndReport('Second sanction', c.OVP2SecondSanction, result, logText)
        result = addAndReport('Years between first two sanctions:',
            (inputs.gender == 'M' ? c.OVP2MaleSecondSanction : c.OVP2FemaleSecondSanction).times(calculatedInputs.yearsBetweenFirstTwoSanctions), result, logText)
    }
    result = addAndReport('Sanction count', c.OVP2TotalSanctionsCoefficient.times(inputs.sanctionCount), result, logText)

    // OFM
    result = addAndReportPolynomial2('OFM', calculatedInputs.ofm > 36 ? 36 : calculatedInputs.ofm, c.OVP2OFM, c.OVP2OFM2, result, logText)

    // Copas and violent offences
    if (inputs.sanctionCount > 2) {
        result = addAndReportCopas('vGeneral', inputs, calculatedInputs, inputs.gender == 'M' ? c.OVP2MaleCOPAS : c.OVP2FemaleCOPAS, result, logText)
    }
    if (inputs.violenceSanctionCount == 0) {
        result = addAndReport('No violent sanctions', inputs.gender == 'M' ? c.OVP2MaleNeverBeenViolent : c.OVP2FemaleNeverBeenViolent, result, logText)
    } else {
        if (inputs.violenceSanctionCount == 1) {
            result = addAndReport('One violent sanction', c.OVP2OneViolentSanction, result, logText)
        }
        result = addAndReport('Violent sanction count', c.OVP2ViolentSanctionCount.times(inputs.violenceSanctionCount), result, logText)
        result = addAndReportCopas('violent', inputs, calculatedInputs, c.OVP2CopasViolentRate, result, logText)
    }

    // Section 3 and 4
    result = addAndReport('3.4', c.OVP2SuitabilityOfAccommodation.times(inputs.threePointFour), result, logText)
    result = addAndReport('4.2', c.OVP2Unemployed.times(inputs.fourPointTwo), result, logText)

    // Section 6
    result = addAndReport('6.4', c.OCP2QualityOfRelationship.times(inputs.sixPointFour), result, logText)
    result = addAndReport('6.7', c.OVP2DVPerpetrator.times(inputs.sixPointSeven), result, logText)
    if (inputs.sixPointEight == 1) {
        result = addAndReport('6.8', c.OVP2CurrentRelationship, result, logText)
        result = addAndReport('6.4 Multiplicative interaction', c.OVP2MultiplicativeRelationship.times(inputs.sixPointFour), result, logText)
    }
    // Section 7, 9, 11, 12
    result = addAndReport('7.2', c.OVP2Regular_Activies.times(inputs.sevenPointTwo), result, logText)
    result = addAndReport('9.1', c.OVP2ChronicDrinker.times(inputs.ninePointOne), result, logText)
    result = addAndReport('9.2', c.OVP2BingeDrinker.times(inputs.ninePointTwo), result, logText)
    result = addAndReport('11.2', c.OVP2Impulsivity.times(inputs.elevenPointTwo), result, logText)
    result = addAndReport('11.4', c.OVP2Temper.times(inputs.elevenPointFour), result, logText)
    result = addAndReport('12.1', c.OVP2ProCriminalAttitude.times(inputs.twelvePointOne), result, logText)

    // Drugs
    result = addAndReport('8.8', c.OVP2MotivationToTackleDrugMisuse.times(inputs.eightPointEight), result, logText)

    if (inputs.heroin == 'Y') result = addAndReport('heroin', c.OVP2Heroin, result, logText)
    if (inputs.crack == 'Y') result = addAndReport('crack', c.OVP2CrackCocaine, result, logText)
    if (inputs.cocaine == 'Y') result = addAndReport('cocaine', c.OVP2PowderCocaine, result, logText)
    if (inputs.prescribed == 'Y') result = addAndReport('prescribed', c.OVP2MisusedPrescription, result, logText)
    if (inputs.benzodiazipines == 'Y') result = addAndReport('benzodiazipines', c.OVP2Benzodiazipines, result, logText)
    if (inputs.amphetamines == 'Y') result = addAndReport('amphetamines', c.OVP2Amphetamines, result, logText)
    if (inputs.ecstasy == 'Y') result = addAndReport('ecstasy', c.OVP2Ecstasy, result, logText)
    if (inputs.cannabis == 'Y') result = addAndReport('cannabis', c.OVP2Cannabis, result, logText)
    if (inputs.steroid == 'Y') result = addAndReport('steroid', c.OVP2Steroids, result, logText)


    // Intercept
    const resultYear1 = addAndReport('Intercept', c.OVP2YearOneIntercept, result, logText)
    const resultYear2 = addAndReport('Intercept', c.OVP2YearTwoIntercept, result, logText)

    const diffYear1 = new Decimal(inputs.expectedResults.ovp2Year1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.ovp2Year2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}
