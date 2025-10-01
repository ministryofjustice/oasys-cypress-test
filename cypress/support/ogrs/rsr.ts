import { CalculationResult, TestCaseParameters, OutputParameters, ScoreBand } from './types'
import { calculateBand, reportScores } from './calculateScore'

export function rsrCalc(params: TestCaseParameters, snsvBResult: CalculationResult, snsvEResult: CalculationResult,
    ospCResult: CalculationResult, ospIResult: CalculationResult, outputParams: OutputParameters): CalculationResult {

    let probability = snsvEResult.probability == null ? snsvBResult.probability : snsvEResult.probability

    if (probability != null && params.ONE_POINT_THIRTY == 'Y') {  // TODO is this the only condition?
        probability = probability + ospCResult.probability + ospIResult.probability
    }

    const band = calculateBand('rsr', probability)
    reportScores(outputParams, 'rsr', null, probability, band, 'Y', [])
    return { zScore: null, probability: probability, band: band, status: 'Y' }
}
