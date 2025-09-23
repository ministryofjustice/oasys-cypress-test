import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function ogrs4VCalc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    let result = new Decimal(0)
    const logText: string[] = []
    const c = coefficients.OGRS4V

    // Age and gender
    if (inputs.gender == 'M') {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.ViolenceMaleAAED, c.ViolenceMaleAAED2, c.ViolenceMaleAAED3, c.ViolenceMaleAAED4, result, logText)
    } else {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.ViolenceFemaleAAED, c.ViolenceFemaleAAED2, c.ViolenceFemaleAAED3, c.ViolenceFemaleAAED4, result, logText)
        result = addAndReport('Female', c.ViolenceFemale, result, logText)
    }

    // Offence
    result = addAndReport('Offence', c.offences[inputs.offence], result, logText)

    // Sanctions
    if (inputs.sanctionCount == 1) {
        result = addAndReport('First sanction', c.ViolenceFirstSanction, result, logText)
    } else if (inputs.sanctionCount == 2) {
        result = addAndReport('Second sanction', c.ViolenceSecondSanction, result, logText)
        result = addAndReport('Years between first two sanctions:',
            (inputs.gender == 'M' ? c.ViolenceMaleSecondSanction : c.ViolenceFemaleSecondSanction).times(calculatedInputs.yearsBetweenFirstTwoSanctions), result, logText)
    }
    result = addAndReport('Sanction count', c.ViolenceTotalSanctionsCoefficient.times(inputs.sanctionCount), result, logText)

    // OFM
    result = addAndReportPolynomial4('OFM', calculatedInputs.ofm > 36 ? 36 : calculatedInputs.ofm, c.ViolenceOFM, c.ViolenceOFM2, c.ViolenceOFM3, c.ViolenceOFM4, result, logText)

    // Violent offences
    if (inputs.violenceSanctionCount == 0) {
        result = addAndReport('No violent sanctions', inputs.gender == 'M' ? c.OGRS4VViolenceMaleNeverSanctioned : c.OGRS4VViolenceFemaleNeverSanctioned, result, logText)
    } else {
        if (inputs.violenceSanctionCount == 1) {
            result = addAndReport('One violent sanction', c.ViolenceOneViolentSanction, result, logText)    
        }
        result = addAndReport('Violent sanction count', c.ViolenceCountOfViolentSanctionsCoefficients.times(inputs.violenceSanctionCount), result, logText)
        result = addAndReportCopas('violent', inputs, calculatedInputs, c.OGRS4VCopasViolent, result, logText)
    }

    // Intercept
    const resultYear1 = addAndReport('Intercept', c.ViolenceYearOneIntercept, result, logText)
    const resultYear2 = addAndReport('Intercept', c.ViolenceYearTwoIntercept, result, logText)

    const diffYear1 = new Decimal(inputs.expectedResults.ogrs4VYear1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.ogrs4VYear2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

     return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}
