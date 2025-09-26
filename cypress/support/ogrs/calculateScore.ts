import { Decimal } from 'decimal.js'

import { OgrsFeatures, coefficients } from './data/coefficients'
import { TestCaseParameters, requiredParams, ScoreResult } from './orgsTest'
import { ScoreType } from './ogrsCalculator'
import { OrgsOffenceCat } from './data/offences'


export function calculate(scoreType: ScoreType, params: TestCaseParameters): ScoreResult {

    // TODO bands/probability

    let zScore = new Decimal(0)
    const logText: string[] = []
    const c = coefficients[scoreType]

    if (params.STATIC_CALC == 'Y' && ['serious_violence_extended', 'general_extended', 'violence_extended', 'osp_c', 'osp_i'].includes(scoreType)) {
        logText.push('Static flag = Y, not calculated')
        return { zScore: null, probability: null, band: null, logText }
    }

    const missing = validateParameters(params, requiredParams[scoreType])
    if (missing.length > 0) {
        missing.forEach((param) => {
            logText.push(`Missing parameter: ${param}`)
        })
        return { zScore: null, probability: null, band: null, logText }
    }

    // Two-year constant
    zScore = addAndReportConditional(c, 'in_year_two_constant', true, zScore, logText)

    // Age and gender
    zScore = addAndReportPolynomial(c, 'aai', params.age, zScore, logText, params.GENDER)
    zScore = addAndReportConditional(c, 'female', params.female, zScore, logText)

    // Offence
    zScore = addAndReportOffence(c, params.offenceCat, zScore, logText)

    // Sanctions
    zScore = addAndReportConditional(c, 'firstsanction', params.firstSanction, zScore, logText)
    zScore = addAndReportConditional(c, 'secondsanction', params.secondSanction, zScore, logText)
    zScore = addAndReportMultiplier(c, 'ogrs3_sanctionoccasions', params.TOTAL_SANCTIONS_COUNT, zScore, logText)
    if (params.secondSanction) {
        zScore = addAndReportMultiplier(c, `yrs_between_first_and_second_sanction_${params.male ? 'male' : 'female'}`, params.yearsBetweenFirstTwoSanctions, zScore, logText)
    }

    // OFM
    zScore = addAndReportPolynomial(c, 'ofm', params.ofm, zScore, logText)

    // Copas and violent offences
    zScore = addAndReportCopas(c, 'g', params, zScore, logText)
    zScore = addAndReportCopas(c, 'squared', params, zScore, logText)
    zScore = addAndReportCopas(c, 'v', params, zScore, logText)
    zScore = addAndReportConditional(c, `never_sanctioned_violent_${params.male ? 'male' : 'female'}`, params.neverSanctionedViolence, zScore, logText)
    zScore = addAndReportConditional(c, 'onceviolent', params.onceViolent, zScore, logText)
    zScore = addAndReportMultiplier(c, 'ogrs3_ovp_sanct', params.TOTAL_VIOLENT_SANCTIONS, zScore, logText)
    zScore = addAndReportCopas(c, 'violent', params, zScore, logText)

    // Sections 2, 3, 4
    zScore = addAndReportMultiplier(c, 's2q2a_carry_use_weapon', params.TWO_POINT_TWO, zScore, logText)
    zScore = addAndReportMultiplier(c, 's3q4_suitability', params.THREE_POINT_FOUR, zScore, logText)
    zScore = addAndReportMultiplier(c, 's4q2_unemployed', params.FOUR_POINT_TWO, zScore, logText)

    // Section 6
    zScore = addAndReportMultiplier(c, 's6q4_partner_relationship', params.SIX_POINT_FOUR, zScore, logText)
    zScore = addAndReportMultiplier(c, 's6q7_perpetrator', params.SIX_POINT_SEVEN, zScore, logText)
    zScore = addAndReportMultiplier(c, 's3q2_lives_with_partner', params.SIX_POINT_EIGHT, zScore, logText)
    zScore = addAndReportMultiplier(c, 'quality_of_livein_relationship', params.SIX_POINT_FOUR * params.SIX_POINT_EIGHT, zScore, logText)

    // Section 7, 9, 11, 12
    zScore = addAndReportMultiplier(c, 's7q2_activities_encourage', params.SEVEN_POINT_TWO, zScore, logText)
    zScore = addAndReportMultiplier(c, 's9q1_current_use', params.NINE_POINT_ONE, zScore, logText)
    zScore = addAndReportMultiplier(c, 's9q2_binge_drinking', params.NINE_POINT_TWO, zScore, logText)
    zScore = addAndReportMultiplier(c, 's11q2_impulsivity', params.ELEVEN_POINT_TWO, zScore, logText)
    zScore = addAndReportMultiplier(c, 's11q4_temper_control', params.ELEVEN_POINT_FOUR, zScore, logText)
    zScore = addAndReportMultiplier(c, 's12q1_procriminal_attitudes', params.TWELVE_POINT_ONE, zScore, logText)

    // Previous convictions

    zScore = addAndReportMultiplier(c, 'r1q2_murder_prev', params.HOMICIDE, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_wounding_prev', params.GBH, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_kidnapping_prev', params.KIDNAP, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_firearm_prev', params.FIREARMS, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_robbery_prev', params.ROBBERY, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_agg_burglary_prev', params.AGGRAVATED_BURGLARY, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_weapons_prev', params.WEAPONS_NOT_FIREARMS, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_damage_with_intent_prev', params.CRIMINAL_DAMAGE_LIFE, zScore, logText)
    zScore = addAndReportMultiplier(c, 'r1q2_arson_prev', params.ARSON, zScore, logText)

    // Drugs
    zScore = addAndReportMultiplier(c, 's8q8_motivation_tackle_misuse', params.EIGHT_POINT_EIGHT, zScore, logText)
    zScore = addAndReportConditional(c, 'dailydrug', params.DAILY_DRUG_USER == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_heroin', params.HEROIN == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_methadone', params.METHADONE == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_otheropiate', params.OTHER_OPIATE == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_crack', params.CRACK_COCAINE == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_cokepowder', params.POWDER_COCAINE == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_prescribed', params.MISUSED_PRESCRIBED == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_benzo', params.BENZODIAZIPINES == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_amphetamine', params.AMPHETAMINES == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_ecstasy', params.ECSTASY == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_cannabis', params.CANNABIS == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_steroid', params.STEROIDS == 'Y', zScore, logText)
    zScore = addAndReportConditional(c, 'drug_current_use_anyotherdrug_new',
        params.HALLUCINOGENS == 'Y' || params.KETAMINE == 'Y' || params.OTHER_DRUGS == 'Y' || params.SOLVENTS == 'Y' || params.SPICE == 'Y',
        zScore, logText)

    const expZ = zScore.exp()
    return { zScore: zScore, probability: expZ.div(expZ.add(1)), band: null, logText: logText }
}


function validateParameters(params: TestCaseParameters, requiredParams: string[]): string[] {

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

function addAndReportPolynomial(coefficientSet: object, type: 'aai' | 'ofm', input: number, runningTotal: Decimal, logText: string[], gender?: string): Decimal {

    let result = new Decimal(0)
    const value = new Decimal(input)
    const genderSuffix = type == 'ofm' ? '' : gender == 'M' ? '_male' : '_female'

    const coef1 = coefficientSet[`${type}${genderSuffix}`]
    if (coef1 == null) return runningTotal

    const coef2 = coefficientSet[`${type}_quadratic${genderSuffix}`]

    result = result.add(value.times(coef1))
    result = result.add(value.pow(2).times(coef2))

    const coef3 = coefficientSet[`${type}_cubic${genderSuffix}`]
    const coef4 = coefficientSet[`${type}_quartic${genderSuffix}`]
    if (coef3 != null && coef4 != null) {
        result = result.add(value.pow(3).times(coef3))
        result = result.add(value.pow(4).times(coef4))
    }

    logText.push(`${type}: ${result}`)
    return runningTotal.add(result)
}

function addAndReportCopas(coefficientSet: object, type: 'g' | 'v' | 'violent' | 'squared', params: TestCaseParameters, runningTotal: Decimal, logText: string[]): Decimal {

    const boost = type == 'v' ? 12 : type == 'violent' ? 30 : 26
    const count = type == 'violent' ? params.TOTAL_VIOLENT_SANCTIONS : params.TOTAL_SANCTIONS_COUNT

    if (count < 1 || (type != 'violent' && count < 3)) return runningTotal

    const genderSuffix = params.male ? '_male' : '_female'
    const coefName = type == 'violent' ? 'ogrs4v_rate_violent' : `three_plus_sanction_copas_${type}${genderSuffix}`
    const coef = coefficientSet[coefName]

    if (coef == null) return runningTotal

    let result = new Decimal(count).div(boost + params.ageAtLastSanction - params.ageAtFirstSanction)
    result = result.ln()
    if (type == 'squared') {
        result = result.pow(2)
    }
    result = result.times(coef)

    logText.push(`Copas ${type}: ${result}`)
    return runningTotal.add(result)
}

function addAndReportConditional(coefficientSet: object, coefficient: OgrsFeatures, condition: boolean, runningTotal: Decimal, logText: string[]): Decimal {

    const value = coefficientSet[coefficient]
    if (value == null || !condition) return runningTotal

    logText.push(`${coefficient}: ${value}`)
    return runningTotal.add(value)
}

function addAndReportMultiplier(coefficientSet: object, coefficient: OgrsFeatures, value: number, runningTotal: Decimal, logText: string[]): Decimal {

    const coef = coefficientSet[coefficient]
    if (coef == null || value == 0) return runningTotal

    const result = coef.times(value)
    logText.push(`${coefficient}: ${result}`)
    return runningTotal.add(result)
}

function addAndReportOffence(coefficientSet: object, offenceCat: OrgsOffenceCat, runningTotal: Decimal, logText: string[]): Decimal {

    let coef = coefficientSet[offenceCat.cat]
    if (coef == null) {
        if (offenceCat.addVatpFlag) {
            coef = Decimal(0)
        } else {
            return runningTotal
        }
    }
    const result = coef.add(offenceCat.addVatpFlag ? coefficientSet['vatp_flag'] : 0)

    logText.push(`${offenceCat.cat}: ${result}`)
    return runningTotal.add(result)
}
