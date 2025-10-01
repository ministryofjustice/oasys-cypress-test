import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { TestCaseParameters, CalculationResult, ScoreType, OutputParameters, ScoreStatus, ScoreBand } from './types'
import { requiredParams } from './ogrsCalculator'
import { OgrsOffenceCat, OgrsFeatures } from './types'
import { addOutputParameter } from './createOutput'

let zScore: Decimal
let c: object
let o: OutputParameters

export function calculate(scoreType: ScoreType, params: TestCaseParameters, outputParams: OutputParameters, skipCalculation: boolean = false): CalculationResult {
    
    o = outputParams
    zScore = new Decimal(0)
    c = coefficients[scoreType]

    if (skipCalculation) {
        reportScores(o, scoreType, null, null, null, 'N', null)
        return { zScore: null, probability: null, band: null, status: 'N' }
    }

    if (params.STATIC_CALC == 'Y' && ['serious_violence_extended', 'general_extended', 'violence_extended'].includes(scoreType)) {
        reportScores(o, scoreType, null, null, null, 'N', null)
        return { zScore: null, probability: null, band: null, status: 'N' }
    }

    const missing = validateParameters(params, requiredParams[scoreType])
    if (missing.length > 0) {
        reportScores(o, scoreType, null, null, null, 'E', missing)
        return { zScore: null, probability: null, band: null, status: 'E' }
    }

    // Two-year constant
    calculateConditional(scoreType, 'in_year_two_constant', true)

    // Age and gender
    calculatePolynomial(scoreType, 'aai', params.age, params.GENDER)
    calculateConditional(scoreType, 'female', params.female)

    // Offence
    calculateOffence(scoreType, params.offenceCat)

    // Sanctions
    calculateConditional(scoreType, 'firstsanction', params.firstSanction)
    calculateConditional(scoreType, 'secondsanction', params.secondSanction)
    calculateMultiplier(scoreType, 'ogrs3_sanctionoccasions', params.TOTAL_SANCTIONS_COUNT)
    calculateMultiplier(scoreType, `yrs_between_first_and_second_sanction_${params.male ? 'male' : 'female'}`, params.yearsBetweenFirstTwoSanctions)

    // OFM
    calculatePolynomial(scoreType, 'ofm', params.ofm)

    // Copas and violent offences
    calculateCopas(scoreType, 'g', params)
    calculateCopas(scoreType, 'squared', params)
    calculateCopas(scoreType, 'v', params)
    calculateConditional(scoreType, `never_sanctioned_violent_${params.male ? 'male' : 'female'}`, params.neverSanctionedViolence)
    calculateConditional(scoreType, 'onceviolent', params.onceViolent)
    calculateMultiplier(scoreType, 'ogrs3_ovp_sanct', params.TOTAL_VIOLENT_SANCTIONS)
    calculateCopas(scoreType, 'violent', params)

    // Sections 2, 3, 4
    calculateMultiplier(scoreType, 's2q2a_carry_use_weapon', params.TWO_POINT_TWO)
    calculateMultiplier(scoreType, 's3q4_suitability', params.THREE_POINT_FOUR)
    calculateMultiplier(scoreType, 's4q2_unemployed', params.FOUR_POINT_TWO)

    // Section 6
    calculateMultiplier(scoreType, 's6q4_partner_relationship', params.SIX_POINT_FOUR)
    calculateMultiplier(scoreType, 's6q7_perpetrator', params.SIX_POINT_SEVEN)
    calculateMultiplier(scoreType, 's3q2_lives_with_partner', params.SIX_POINT_EIGHT)
    calculateMultiplier(scoreType, 'quality_of_livein_relationship', params.SIX_POINT_FOUR * params.SIX_POINT_EIGHT)

    // Section 7, 9, 11, 12
    calculateMultiplier(scoreType, 's7q2_activities_encourage', params.SEVEN_POINT_TWO)
    calculateMultiplier(scoreType, 's9q1_current_use', params.NINE_POINT_ONE)
    calculateMultiplier(scoreType, 's9q2_binge_drinking', params.NINE_POINT_TWO)
    calculateMultiplier(scoreType, 's11q2_impulsivity', params.ELEVEN_POINT_TWO)
    calculateMultiplier(scoreType, 's11q4_temper_control', params.ELEVEN_POINT_FOUR)
    calculateMultiplier(scoreType, 's12q1_procriminal_attitudes', params.TWELVE_POINT_ONE)

    // Previous convictions

    calculateMultiplier(scoreType, 'r1q2_murder_prev', params.HOMICIDE)
    calculateMultiplier(scoreType, 'r1q2_wounding_prev', params.GBH)
    calculateMultiplier(scoreType, 'r1q2_kidnapping_prev', params.KIDNAP)
    calculateMultiplier(scoreType, 'r1q2_firearm_prev', params.FIREARMS)
    calculateMultiplier(scoreType, 'r1q2_robbery_prev', params.ROBBERY)
    calculateMultiplier(scoreType, 'r1q2_agg_burglary_prev', params.AGGRAVATED_BURGLARY)
    calculateMultiplier(scoreType, 'r1q2_weapons_prev', params.WEAPONS_NOT_FIREARMS)
    calculateMultiplier(scoreType, 'r1q2_damage_with_intent_prev', params.CRIMINAL_DAMAGE_LIFE)
    calculateMultiplier(scoreType, 'r1q2_arson_prev', params.ARSON)

    // Drugs
    calculateMultiplier(scoreType, 's8q8_motivation_tackle_misuse', params.EIGHT_POINT_EIGHT)
    calculateConditional(scoreType, 'dailydrug', params.DAILY_DRUG_USER == 'Y')
    calculateConditional(scoreType, 'drug_current_use_heroin', params.HEROIN == 'Y')
    calculateConditional(scoreType, 'drug_current_use_methadone', params.METHADONE == 'Y')
    calculateConditional(scoreType, 'drug_current_use_otheropiate', params.OTHER_OPIATE == 'Y')
    calculateConditional(scoreType, 'drug_current_use_crack', params.CRACK_COCAINE == 'Y')
    calculateConditional(scoreType, 'drug_current_use_cokepowder', params.POWDER_COCAINE == 'Y')
    calculateConditional(scoreType, 'drug_current_use_prescribed', params.MISUSED_PRESCRIBED == 'Y')
    calculateConditional(scoreType, 'drug_current_use_benzo', params.BENZODIAZIPINES == 'Y')
    calculateConditional(scoreType, 'drug_current_use_amphetamine', params.AMPHETAMINES == 'Y')
    calculateConditional(scoreType, 'drug_current_use_ecstasy', params.ECSTASY == 'Y')
    calculateConditional(scoreType, 'drug_current_use_cannabis', params.CANNABIS == 'Y')
    calculateConditional(scoreType, 'drug_current_use_steroid', params.STEROIDS == 'Y')
    calculateConditional(scoreType, 'drug_current_use_anyotherdrug_new',
        params.HALLUCINOGENS == 'Y' || params.KETAMINE == 'Y' || params.OTHER_DRUGS == 'Y' || params.SOLVENTS == 'Y' || params.SPICE == 'Y')

    const probability = calculateProbability(zScore)
    const band = calculateBand(scoreType, probability)

    reportScores(o, scoreType, zScore, probability, band, 'Y', [])
    return { zScore: zScore, probability: probability, band: band, status: 'Y' }
}


export function validateParameters(params: TestCaseParameters, requiredParams: string[]): string[] {

    const missing: string[] = []
    requiredParams.forEach((param) => {
        if (params[param] == null) {
            missing.push(param)
        }
    })
    if (!params.male && !params.female) {
        missing.push('Invalid gender')
    }
    return missing
}

function calculatePolynomial(scoreType: ScoreType, type: 'aai' | 'ofm', input: number, gender?: string): Decimal {

    let result = new Decimal(0)
    const value = new Decimal(input)
    const genderSuffix = type == 'ofm' ? '' : gender == 'M' ? '_male' : '_female'

    const coef1 = c[`${type}${genderSuffix}`]
    if (coef1 == null) return null

    const coef2 = c[`${type}_quadratic${genderSuffix}`]

    result = result.add(value.times(coef1))
    result = result.add(value.pow(2).times(coef2))

    const coef3 = c[`${type}_cubic${genderSuffix}`]
    const coef4 = c[`${type}_quartic${genderSuffix}`]
    if (coef3 != null && coef4 != null) {
        result = result.add(value.pow(3).times(coef3))
        result = result.add(value.pow(4).times(coef4))
    }

    zScore = zScore.add(result)
    addOutputParameter(o, scoreType, type, result.toNumber())
}

function calculateCopas(scoreType: ScoreType, type: 'g' | 'v' | 'violent' | 'squared', params: TestCaseParameters) {

    const boost = type == 'v' ? 12 : type == 'violent' ? 30 : 26
    const count = type == 'violent' ? params.TOTAL_VIOLENT_SANCTIONS : params.TOTAL_SANCTIONS_COUNT
    let result = Decimal(0)

    if (count > 2 || (type == 'violent' && count > 0)) {

        const genderSuffix = params.male ? '_male' : '_female'
        const coefName = type == 'violent' ? 'ogrs4v_rate_violent' : `three_plus_sanction_copas_${type}${genderSuffix}`
        const coef = c[coefName]

        if (coef != null) {
            result = new Decimal(count).div(boost + params.ageAtLastSanction - params.ageAtFirstSanction)
            result = result.ln()
            if (type == 'squared') {
                result = result.pow(2)
            }
            result = result.times(coef)
        }
    }

    zScore = zScore.add(result)
    addOutputParameter(o, scoreType, type, result.toNumber())
}

function calculateConditional(scoreType: ScoreType, item: OgrsFeatures, condition: boolean) {

    const coef = c[item]
    const result = (coef == null || coef == undefined || !condition) ? new Decimal(0) : coef

    zScore = zScore.add(result)
    addOutputParameter(o, scoreType, item, result.toNumber())
}

function calculateMultiplier(scoreType: ScoreType, item: OgrsFeatures, value: number) {

    const coef = c[item]
    const result = (coef == null || coef == undefined || value == 0) ? new Decimal(0) : coef.times(value)

    zScore = zScore.add(result)
    addOutputParameter(o, scoreType, item, result.toNumber())
}

function calculateOffence(scoreType: ScoreType, offenceCat: OgrsOffenceCat) {

    let coef = c[offenceCat.cat]
    let result = coef == null ? new Decimal(0) : coef
    if (offenceCat.addVatpFlag) {
        result = result.add(c['vatp_flag'])
    }

    zScore = zScore.add(result)
    addOutputParameter(o, scoreType, 'offence', result.toNumber())
}

export function calculateProbability(zScore: Decimal): number {

    const expZ = zScore.exp()
    return expZ.div(expZ.add(1)).times(10000).round().div(100).toNumber()
}

export function reportScores(outputParams: OutputParameters, scoreType: ScoreType, zScore: Decimal, probability: number, band: string, status: ScoreStatus, missingQuestions: string[]) {

    addOutputParameter(outputParams, scoreType, 'score', zScore?.toNumber())
    addOutputParameter(outputParams, scoreType, 'probability', probability)
    addOutputParameter(outputParams, scoreType, 'band', band)
    addOutputParameter(outputParams, scoreType, 'status', status)

    if (missingQuestions != null) {
        addOutputParameter(outputParams, scoreType, 'missingCount', missingQuestions.length)
        addOutputParameter(outputParams, scoreType, 'missingQuestions', JSON.stringify(missingQuestions).replace('[', '').replace(']', ''))
    }
}


export function calculateBand(scoreType: ScoreType, probability: number): ScoreBand {
    switch (scoreType) {
        case 'rsr':
        case 'serious_violence_brief':
        case 'serious_violence_extended':
            return probability >= 6.9 ? 'High' : probability >= 3 ? 'Medium' : 'Low'
        case 'general_brief':
        case 'violence_brief':
            return probability >= 90 ? 'Very High' : probability >= 75 ? 'High' : probability >= 50 ? 'Medium' : 'Low'
        case 'general_extended':
            return probability >= 78 ? 'Very High' : probability >= 62 ? 'High' : probability >= 39 ? 'Medium' : 'Low'
        case 'violence_extended':
            return probability >= 73 ? 'Very High' : probability >= 60 ? 'High' : probability >= 42 ? 'Medium' : 'Low'
    }
    return null
}