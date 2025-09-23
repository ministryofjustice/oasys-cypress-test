import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { addAndReportPolynomial4, addAndReportCopas, addAndReport } from './ogrsCalculator'

export function snsvBCalc(inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, tolerance: Decimal): IndividualCalcResult {

    let result = new Decimal(0)
    const logText: string[] = []
    const c = coefficients.SNSVB

    // Age and gender
    if (inputs.gender == 'M') {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.SNSVBMaleAAEDAD, c.SNSVBMaleAAEDAD2, c.SNSVBMaleAAEDAD3, c.SNSVBMaleAAEDAD4, result, logText)
    } else {
        result = addAndReportPolynomial4('AAEAD', calculatedInputs.age, c.SNSVBFemaleAAEDAD, c.SNSVBFemaleAAEDAD2, c.SNSVBFemaleAAEDAD3, c.SNSVBFemaleAAEDAD4, result, logText)
        result = addAndReport('Female', c.SNSVBFemale, result, logText)
    }

    // Offence
    result = addAndReport('Offence', c.offences[inputs.offence], result, logText)

    // Sanctions
    if (inputs.sanctionCount == 1) {
        result = addAndReport('First sanction', c.SNSVBFirstSanction, result, logText)
    } else if (inputs.sanctionCount == 2) {
        result = addAndReport('Second sanction', c.SNSVBSecondSanction, result, logText)
        result = addAndReport('Years between first two sanctions:',
            (inputs.gender == 'M' ? c.SNSVBMaleSecondSanction : c.SNSVBFemaleSecondSanction).times(calculatedInputs.yearsBetweenFirstTwoSanctions), result, logText)
    }
    result = addAndReport('Sanction count', c.SNSVBTotalSanctionsCoefficient.times(inputs.sanctionCount), result, logText)

    // OFM
    result = addAndReportPolynomial4('OFM', calculatedInputs.ofm > 36 ? 36 : calculatedInputs.ofm, c.SNSVBOFM1, c.SNSVBOFM2, c.SNSVBOFM3, c.SNSVBOFM4, result, logText)

    // Copas and violent offences
    if (inputs.sanctionCount > 2) {
        result = addAndReportCopas('vGeneral', inputs, calculatedInputs, inputs.gender == 'M' ? c.SNSVBMaleCopasVGeneral : c.SNSVBFemaleCopasVGeneral, result, logText)
    }

    if (inputs.violenceSanctionCount == 0) {
        result = addAndReport('Never been violent', inputs.gender == 'M' ? c.SNSVBMaleNeverBeenViolent : c.SNSVBFemaleNeverBeenViolent, result, logText)
    } else if (inputs.violenceSanctionCount == 1) {
        result = addAndReport('One violent sanction', c.SNSVBOnceViolent, result, logText)
    }

    if (inputs.violenceSanctionCount > 0) {
        result = addAndReport('Violent sanction count', c.SNSVBViolentOffenceCount.times(inputs.violenceSanctionCount), result, logText)
        result = addAndReportCopas('violent', inputs, calculatedInputs, c.SNSVBCopasViolent, result, logText)
    }

    // Intercept
    const resultYear1 = addAndReport('Intercept', c.SNSVBYearOneIntercept, result, logText)
    const resultYear2 = addAndReport('Intercept', c.SNSVBYearTwoIntercept, result, logText)

    const diffYear1 = new Decimal(inputs.expectedResults.snsvBYear1).minus(resultYear1).abs()
    const diffYear2 = new Decimal(inputs.expectedResults.snsvBYear2).minus(resultYear2).abs()
    const pass = diffYear1.lessThanOrEqualTo(tolerance) && diffYear2.lessThanOrEqualTo(tolerance)

    return { resultYear1: resultYear1.toString(), resultYear2: resultYear2.toString(), diffYear1: diffYear1.toString(), diffYear2: diffYear2.toString(), pass: pass, logText: logText }
}
