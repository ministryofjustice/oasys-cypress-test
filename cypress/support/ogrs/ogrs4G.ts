import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function ogrs4GCalc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    let result = new Decimal(0)
    const logText: string[] = []
    const c = coefficients.OGRS4G

    // Age and gender
    if (inputs.gender == 'M') {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.GeneralMaleAAED, c.GeneralMaleAAED2, c.GeneralMaleAAED3, c.GeneralMaleAAED4, result, logText)
    } else {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.GeneralFemaleAAED, c.GeneralFemaleAAED2, c.GeneralFemaleAAED3, c.GeneralFemaleAAED4, result, logText)
        result = addAndReport('Female', c.GeneralFemale, result, logText)
    }

    // Offence
    result = addAndReport('Offence', c.offences[inputs.offence], result, logText)

    // Sanctions
    if (inputs.sanctionCount == 1) {
        result = addAndReport('First sanction', c.GeneralFirstSanction, result, logText)
    } else if (inputs.sanctionCount == 2) {
        result = addAndReport('Second sanction', c.GeneralSecondSanction, result, logText)
        result = addAndReport('Years between first two sanctions:',
            (inputs.gender == 'M' ? c.GeneralMaleSecondSanction : c.GeneralFemaleSecondSanction).times(calculatedInputs.yearsBetweenFirstTwoSanctions), result, logText)
    }
    result = addAndReport('Sanction count', c.GeneralTotalSanctionsCoefficient.times(inputs.sanctionCount), result, logText)

    // OFM
    result = addAndReportPolynomial4('OFM', calculatedInputs.ofm > 36 ? 36 : calculatedInputs.ofm, c.GeneralOFM, c.GeneralOFM2, c.GeneralOFM3, c.GeneralOFM4, result, logText)

    // Copas
    if (inputs.sanctionCount > 2) {
        result = addAndReportCopas('general', inputs, calculatedInputs, inputs.gender == 'M' ? c.GeneralMaleCOPAS : c.GeneralFemaleCOPAS, result, logText)
        result = addAndReportCopas('generalSquared', inputs, calculatedInputs, inputs.gender == 'M' ? c.GeneralMaleCOPASSquared : c.GeneralFemaleCOPASSquared, result, logText)
    }

    // Intercept
    const resultYear1 = addAndReport('Intercept', c.GeneralYearOneIntercept, result, logText)
    const resultYear2 = addAndReport('Intercept', c.GeneralYearTwoIntercept, result, logText)

    const diffYear1 = new Decimal(inputs.expectedResults.ogrs4GYear1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.ogrs4GYear2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}
