import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial2, addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function ogp2Calc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    let result = new Decimal(0)
    const logText: string[] = []
    const c = coefficients.OGP2

    // Age and gender
    if (inputs.gender == 'M') {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.OGP2MaleAAED, c.OGP2MaleAAED2, c.OGP2MaleAAED3, c.OGP2MaleAAED4, result, logText)
    } else {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.OGP2FemaleAAED, c.OGP2FemaleAAED2, c.OGP2FemaleAAED3, c.OGP2FemaleAAED4, result, logText)
        result = addAndReport('Female', c.OGP2Female, result, logText)
    }

    // Offence
    result = addAndReport('Offence', c.offences[inputs.offence], result, logText)

    // Sanctions
    if (inputs.sanctionCount == 1) {
        result = addAndReport('First sanction', c.OGP2FirstSanction, result, logText)
    } else if (inputs.sanctionCount == 2) {
        result = addAndReport('Second sanction', c.OGP2SecondSanction, result, logText)
        result = addAndReport('Years between first two sanctions:',
            (inputs.gender == 'M' ? c.OGP2lMaleSecondSanction : c.OGP2FemaleSecondSanction).times(calculatedInputs.yearsBetweenFirstTwoSanctions), result, logText)
    }
    result = addAndReport('Sanction count', c.OGP2TotalSanctionsCoefficient.times(inputs.sanctionCount), result, logText)

    // OFM
    result = addAndReportPolynomial2('OFM', calculatedInputs.ofm > 36 ? 36 : calculatedInputs.ofm, c.OGP2OFM, c.OGP2OFM2, result, logText)

    // Copas
    if (inputs.sanctionCount > 2) {
        result = addAndReportCopas('general', inputs, calculatedInputs, inputs.gender == 'M' ? c.OGP2MaleCOPAS : c.OGP2FemaleCOPAS, result, logText)
        result = addAndReportCopas('generalSquared', inputs, calculatedInputs, inputs.gender == 'M' ? c.OGP2MaleCOPASSquared : c.OGP2FemaleCOPASSquared, result, logText)
    }

    // Section 3 and 4
    result = addAndReport('3.4', c.OGP2SuitabilityOfAccommodation.times(inputs.threePointFour), result, logText)
    result = addAndReport('4.2', c.OGP2Unemployed.times(inputs.fourPointTwo), result, logText)

    // Section 6
    result = addAndReport('6.4', c.OGP2QualityOfRelationship.times(inputs.sixPointFour), result, logText)
    result = addAndReport('6.7', c.OGP2DVPerpetrator.times(inputs.sixPointSeven), result, logText)
    if (inputs.sixPointEight == 1) { 
        result = addAndReport('6.8', c.OGP2CurrentRelationship, result, logText)
        result = addAndReport('6.4 Multiplicative interaction', c.OGP2MultiplicativeRelationship.times(inputs.sixPointFour), result, logText)
    }
    // Section 7, 9, 11, 12
    result = addAndReport('7.2', c.OGP2Regular_Activies.times(inputs.sevenPointTwo), result, logText)
    result = addAndReport('9.1', c.OGP2ChronicDrinker.times(inputs.ninePointOne), result, logText)
    result = addAndReport('9.2', c.OGP2BingeDrinker.times(inputs.ninePointTwo), result, logText)
    result = addAndReport('11.2', c.OGP2Impulsivity.times(inputs.elevenPointTwo), result, logText)
    result = addAndReport('12.1', c.OGP2ProCriminalAttitude.times(inputs.twelvePointOne), result, logText)

    // Drugs
    result = addAndReport('8.8', c.OGP2MotivationToTackleDrugMisuse.times(inputs.eightPointEight), result, logText)
    if (inputs.dailyDrugsUse == 'Y') result = addAndReport('Daily drug user', c.OGP2DailyDrugUser, result, logText) 

    if (inputs.heroin == 'Y') result = addAndReport('heroin', c.OGP2Heroin, result, logText)
    if (inputs.methadone == 'Y') result = addAndReport('methadone', c.OGP2Methadone, result, logText)
    if (inputs.otherOpiate == 'Y') result = addAndReport('otherOpiate', c.OGP2OtherOpiate, result, logText)
    if (inputs.crack == 'Y') result = addAndReport('crack', c.OGP2CrackCocaine, result, logText)
    if (inputs.cocaine == 'Y') result = addAndReport('cocaine', c.OGP2PowderCocaine, result, logText)
    if (inputs.prescribed == 'Y') result = addAndReport('prescribed', c.OGP2MisusedPrescription, result, logText)
    if (inputs.benzodiazipines == 'Y') result = addAndReport('benzodiazipines', c.OGP2Benzodiazipines, result, logText)
    if (inputs.amphetamines == 'Y') result = addAndReport('amphetamines', c.OGP2Amphetamines, result, logText)
    if (inputs.ecstasy == 'Y') result = addAndReport('ecstasy', c.OGP2Ecstasy, result, logText)
    if (inputs.cannabis == 'Y') result = addAndReport('cannabis', c.OGP2Cannabis, result, logText)
    if (inputs.steroid == 'Y') result = addAndReport('steroid', c.OGP2Steroids, result, logText)
    if (inputs.other == 'Y') result = addAndReport('other', c.OGP2HallucinogensKetOther, result, logText)

    // Intercept
    const resultYear1 = addAndReport('Intercept', c.OGP2YearOneIntercept, result, logText)
    const resultYear2 = addAndReport('Intercept', c.OGP2YearTwoIntercept, result, logText)

    const diffYear1 = new Decimal(inputs.expectedResults.ogp2Year1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.ogp2Year2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}

