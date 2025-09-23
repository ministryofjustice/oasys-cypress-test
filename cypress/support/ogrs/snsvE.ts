import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function snsvECalc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    let result = new Decimal(0)
    const logText: string[] = []
    const c = coefficients.SNSVE

    // Age and gender
    if (inputs.gender == 'M') {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.SNSVEMaleAAEAD1, c.SNSVEMaleAAEAD2, c.SNSVEMaleAAEAD3, c.SNSVEMaleAAEAD4, result, logText)
    } else {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.SNSVEFemaleAAEAD1, c.SNSVEFemaleAAEAD2, c.SNSVEFemaleAAEAD3, c.SNSVEFemaleAAEAD4, result, logText)
        result = addAndReport('Female', c.SNSVEFemale, result, logText)
    }

    // Offence
    result = addAndReport('Offence', c.offences[inputs.offence], result, logText)

    // Sanctions
    if (inputs.sanctionCount == 1) {
        result = addAndReport('First sanction', c.SNSVEFirstSanction, result, logText)
    } else if (inputs.sanctionCount == 2) {
        result = addAndReport('Second sanction', c.SNSVESecondSanction, result, logText)
        result = addAndReport('Years between first two sanctions',
            (inputs.gender == 'M' ? c.SNSVEMaleSecondSanction : c.SNSVEFemaleSecondSanction).times(calculatedInputs.yearsBetweenFirstTwoSanctions), result, logText)
    }
    result = addAndReport('Sanction count', c.SNSVECountOfSanctions.times(inputs.sanctionCount), result, logText)

    // OFM
    result = addAndReportPolynomial4('OFM', calculatedInputs.ofm > 36 ? 36 : calculatedInputs.ofm, c.SNSVEOFM1, c.SNSVEOFM2, c.SNSVEOFM3, c.SNSVEOFM4, result, logText)

    // Copas and violent offences
    if (inputs.sanctionCount > 2) {
        result = addAndReportCopas('vGeneral', inputs, calculatedInputs, inputs.gender == 'M' ? c.SNSVEMaleCopasVGeneral : c.SNSVEFemaleCopasVGeneral, result, logText)
    }

    if (inputs.violenceSanctionCount == 0) {
        result = addAndReport('Never been violent', inputs.gender == 'M' ? c.SNSVEMaleNeverViolent : c.SNSVEFemaleNeverViolent, result, logText)
    } else if (inputs.violenceSanctionCount == 1) {
        result = addAndReport('One violent sanction', c.SNSVEOnceViolent, result, logText)
    }

    if (inputs.violenceSanctionCount > 0) {
        result = addAndReport('Violent sanction count', c.SNSVECountOfViolentSanctions.times(inputs.violenceSanctionCount), result, logText)
        result = addAndReportCopas('violent', inputs, calculatedInputs, c.SNSVECopasViolent, result, logText)
    }

    // Criminogenic need
    result = addAndReport('2.2A', c.SNSVEWeaponUse.times(inputs.twoPointTwoA), result, logText)
    result = addAndReport('3.4', c.SNSVESuitableAccommodation.times(inputs.threePointFour), result, logText)
    result = addAndReport('4.2', c.SNSVEUnemployed.times(inputs.fourPointTwo), result, logText)
    result = addAndReport('6.4', c.SNSVEQualityOfRelationship.times(inputs.sixPointFour), result, logText)
    result = addAndReport('6.7 perp', c.SNSVEDomesticViolencePerp.times(inputs.sixPointSeven), result, logText)
    result = addAndReport('9.1', c.SNSVEChronicDrinking.times(inputs.ninePointOne), result, logText)
    result = addAndReport('9.2', c.SNSVEBingeDrinking.times(inputs.ninePointTwo), result, logText)
    result = addAndReport('11.2', c.SNSVEImpulsivity.times(inputs.elevenPointTwo), result, logText)
    result = addAndReport('11.4', c.SNSVETemperControl.times(inputs.elevenPointFour), result, logText)
    result = addAndReport('12.1', c.SNSVEProCriminal.times(inputs.twelvePointOne), result, logText)

    // Previous convictions

    result = addAndReport('Previous homicide', c.SNSVEPreviousHomicide.times(inputs.previousHomicide), result, logText)
    result = addAndReport('Previous wounding / grievous bodily harm', c.SNSVEPreviousWoundingGBH.times(inputs.previousWoundingGBH), result, logText)
    result = addAndReport('Previous kidnapping', c.SNSVEPreviousKidnapping.times(inputs.previousKidnapping), result, logText)
    result = addAndReport('Previous offences involving firearms', c.SNSVEPreviousFirearms.times(inputs.previousFirearms), result, logText)
    result = addAndReport('Previous robbery', c.SNSVEPreviousRobbery.times(inputs.previousRobbery), result, logText)
    result = addAndReport('Previous aggravated burglary', c.SNSVEPreviousAggBurglary.times(inputs.previousAggBurglary), result, logText)
    result = addAndReport('Previous offences involving weapons other than firearms', c.SNSVEPreviousWeaponsNotFirearms.times(inputs.previousWeaponsNotFirearms), result, logText)
    result = addAndReport('Previous criminal damage endangering life', c.SNSVEPreviousCrimDamageEndangeringLife.times(inputs.previousCrimDamageEndangeringLife), result, logText)
    result = addAndReport('Previous arson', c.SNSVEPreviousArson.times(inputs.previousArson), result, logText)

    // Intercept
    const resultYear1 = addAndReport('Intercept', c.SNSVEYearOneIntercept, result, logText)
    const resultYear2 = addAndReport('Intercept', c.SNSVEYearTwoIntercept, result, logText)

    const diffYear1 = new Decimal(inputs.expectedResults.snsvEYear1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.snsvEYear2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}
