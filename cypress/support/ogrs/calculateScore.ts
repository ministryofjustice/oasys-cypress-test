import { Decimal } from 'decimal.js'

import { coefficients } from './data/coefficients'
import { TestCaseParameters, ScoreType, OutputParameters, ScoreBand } from './types'
import { OgrsOffenceCat, OgrsFeatures } from './types'
import { addOutputParameter, outputScoreName, reportScores } from './createOutput'


export function calculate(scoreType: ScoreType, params: TestCaseParameters, outputParams: OutputParameters, skipCalculation: boolean = false): Decimal {

    // Calculate any of the scores other than OSP and RSR.  The selected coefficient set (depending on scoreType) determines which components make up the score.

    // Brief versions skipped if the extended version has been calculated
    if (skipCalculation) {
        reportScores(outputParams, scoreType, null, null, null, 'N', 0, `''`)
        return null
    }

    // Extended versions skipped if STATIC_CALC flag set
    if (params.STATIC_CALC == 'Y' && ['serious_violence_extended', 'general_extended', 'violence_extended'].includes(scoreType)) {
        reportScores(outputParams, scoreType, null, null, null, 'N', 0, `''`)
        return null
    }

    // Check for missing parameters or invalid gender
    if (!params.male && !params.female) {
        reportScores(outputParams, scoreType, null, null, null, 'E', 0, `'${outputScoreName[scoreType]} can't be calculated on gender other than Male and Female.'`)
        return null
    }
    const missing = checkMissingQuestions(params, requiredParams[scoreType])
    if (missing.count > 0) {
        reportScores(outputParams, scoreType, null, null, null, 'E', missing.count, missing.result)
        return null
    }

    // zScore holds a running total
    let zScore = new Decimal(0)
    const coefs = coefficients[scoreType]

    // Two-year constant
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'in_year_two_constant', true, outputParams))

    // Age and gender
    zScore = zScore.add(calculatePolynomial(scoreType, coefs, 'aai', params.age, outputParams, params.GENDER))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'female', params.female, outputParams))

    // Offence
    zScore = zScore.add(calculateOffence(scoreType, coefs, params.offenceCat, outputParams))

    // Sanctions
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'firstsanction', params.firstSanction, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'secondsanction', params.secondSanction, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'ogrs3_sanctionoccasions', params.TOTAL_SANCTIONS_COUNT, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, `yrs_between_first_and_second_sanction_${params.male ? 'male' : 'female'}`, params.yearsBetweenFirstTwoSanctions, outputParams))

    // OFM
    zScore = zScore.add(calculatePolynomial(scoreType, coefs, 'ofm', params.ofm, outputParams))

    // Copas general
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'g', params, outputParams))
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'squared', params, outputParams))
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'v', params, outputParams))

    // Violent offences
    zScore = zScore.add(calculateConditional(scoreType, coefs, `never_sanctioned_violent_${params.male ? 'male' : 'female'}`, params.neverSanctionedViolence, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'onceviolent', params.onceViolent, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'ogrs3_ovp_sanct', params.TOTAL_VIOLENT_SANCTIONS, outputParams))
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'violent', params, outputParams))

    // Sections 2, 3, 4
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's2q2a_carry_use_weapon', params.TWO_POINT_TWO, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's3q4_suitability', params.THREE_POINT_FOUR, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's4q2_unemployed', params.FOUR_POINT_TWO, outputParams))

    // Section 6
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's6q4_partner_relationship', params.SIX_POINT_FOUR, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's6q7_perpetrator', params.SIX_POINT_SEVEN, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's3q2_lives_with_partner', params.SIX_POINT_EIGHT, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'quality_of_livein_relationship', params.SIX_POINT_FOUR * params.SIX_POINT_EIGHT, outputParams))

    // Section 7, 9, 11, 12
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's7q2_activities_encourage', params.SEVEN_POINT_TWO, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's9q1_current_use', params.NINE_POINT_ONE, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's9q2_binge_drinking', params.NINE_POINT_TWO, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's11q2_impulsivity', params.ELEVEN_POINT_TWO, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's11q4_temper_control', params.ELEVEN_POINT_FOUR, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's12q1_procriminal_attitudes', params.TWELVE_POINT_ONE, outputParams))

    // Drugs
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 's8q8_motivation_tackle_misuse', params.EIGHT_POINT_EIGHT, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'dailydrug', params.DAILY_DRUG_USER == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_heroin', params.HEROIN == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_methadone', params.METHADONE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_otheropiate', params.OTHER_OPIATE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_crack', params.CRACK_COCAINE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_cokepowder', params.POWDER_COCAINE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_prescribed', params.MISUSED_PRESCRIBED == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_benzo', params.BENZODIAZIPINES == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_amphetamine', params.AMPHETAMINES == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_ecstasy', params.ECSTASY == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_cannabis', params.CANNABIS == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_steroid', params.STEROIDS == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_current_use_anyotherdrug_new',
        params.HALLUCINOGENS == 'Y' || params.KETAMINE == 'Y' || params.OTHER_DRUGS == 'Y' || params.SOLVENTS == 'Y' || params.SPICE == 'Y', outputParams))

    // Previous convictions
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_murder_prev', params.HOMICIDE, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_wounding_prev', params.GBH, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_kidnapping_prev', params.KIDNAP, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_firearm_prev', params.FIREARMS, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_robbery_prev', params.ROBBERY, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_agg_burglary_prev', params.AGGRAVATED_BURGLARY, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_weapons_prev', params.WEAPONS_NOT_FIREARMS, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_damage_with_intent_prev', params.CRIMINAL_DAMAGE_LIFE, outputParams))
    zScore = zScore.add(calculateMultiplier(scoreType, coefs, 'r1q2_arson_prev', params.ARSON, outputParams))

    // Calculate probability and band, output the results
    const probability = calculateProbability(zScore)
    const percentage = probabilityToPercentage(probability)
    const band = calculateBand(scoreType, percentage)

    reportScores(outputParams, scoreType, zScore, percentage, band, 'Y', 0, `''`)
    return probability
}


function calculatePolynomial(scoreType: ScoreType, coefs: object, type: 'aai' | 'ofm', input: number, outputParams: OutputParameters, gender?: string): Decimal {

    // Calculate a 2 or 4 level polynomial depending on which coefficients are available

    let result = new Decimal(0)
    const value = new Decimal(input)
    const genderSuffix = type == 'ofm' ? '' : gender == 'M' ? '_male' : '_female'

    const coef1 = coefs[`${type}${genderSuffix}`]
    if (coef1 == null) return null

    const coef2 = coefs[`${type}_quadratic${genderSuffix}`]

    result = result.add(value.times(coef1))
    result = result.add(value.pow(2).times(coef2))

    const coef3 = coefs[`${type}_cubic${genderSuffix}`]
    const coef4 = coefs[`${type}_quartic${genderSuffix}`]
    if (coef3 != null && coef4 != null) {
        result = result.add(value.pow(3).times(coef3))
        result = result.add(value.pow(4).times(coef4))
    }

    addOutputParameter(outputParams, scoreType, type, result)
    return result
}

function calculateCopas(scoreType: ScoreType, coefs: object, type: 'g' | 'v' | 'violent' | 'squared', params: TestCaseParameters, outputParams: OutputParameters): Decimal {

    const boost = type == 'v' ? 12 : type == 'violent' ? 30 : 26
    const count = type == 'violent' ? params.TOTAL_VIOLENT_SANCTIONS : params.TOTAL_SANCTIONS_COUNT
    let result = Decimal(0)

    if (count > 2 || (type == 'violent' && count > 0)) {

        const genderSuffix = params.male ? '_male' : '_female'
        const coefName = type == 'violent' ? 'ogrs4v_rate_violent' : `three_plus_sanction_copas_${type}${genderSuffix}`
        const coef = coefs[coefName]

        if (coef != null) {
            result = new Decimal(count).div(boost + params.ageAtLastSanction - params.AGE_AT_FIRST_SANCTION)
            result = result.ln()
            if (type == 'squared') {
                result = result.pow(2)
            }
            result = result.times(coef)
        }
    }

    addOutputParameter(outputParams, scoreType, type, result)
    return result
}

function calculateConditional(scoreType: ScoreType, coefs: object, item: OgrsFeatures, condition: boolean, outputParams: OutputParameters): Decimal {

    const coef = coefs[item]
    const result = (coef == null || coef == undefined || !condition) ? new Decimal(0) : coef

    addOutputParameter(outputParams, scoreType, item, result)
    return result
}

function calculateMultiplier(scoreType: ScoreType, coefs: object, item: OgrsFeatures, value: number, outputParams: OutputParameters): Decimal {

    const coef = coefs[item]
    const result = (coef == null || coef == undefined || value == 0 || value == null) ? new Decimal(0) : coef.times(value)

    addOutputParameter(outputParams, scoreType, item, result)
    return result
}

function calculateOffence(scoreType: ScoreType, coefs: object, offenceCat: OgrsOffenceCat, outputParams: OutputParameters): Decimal {

    let coef = coefs[offenceCat.cat]
    let result = coef == null ? new Decimal(0) : coef
    if (offenceCat.addVatpFlag) {
        result = result.add(coefs['vatp_flag'])
    }

    addOutputParameter(outputParams, scoreType, 'offence', result)
    return result
}

export function calculateProbability(zScore: Decimal): Decimal {

    const expZ = zScore.exp()
    return expZ.div(expZ.add(1))
}

export function probabilityToPercentage(probability: Decimal): Decimal {

    return probability?.times(10000).round().div(100) ?? null
}

export function calculateBand(scoreType: ScoreType, probability: Decimal): ScoreBand {

    if (probability == null) return null

    switch (scoreType) {
        case 'rsr':
        case 'serious_violence_brief':
        case 'serious_violence_extended':
            return probability.greaterThanOrEqualTo(6.9) ? 'High' : probability.greaterThanOrEqualTo(3) ? 'Medium' : 'Low'
        case 'general_brief':
        case 'violence_brief':
            return probability.greaterThanOrEqualTo(90) ? 'Very High' : probability.greaterThanOrEqualTo(75) ? 'High' : probability.greaterThanOrEqualTo(50) ? 'Medium' : 'Low'
        case 'general_extended':
            return probability.greaterThanOrEqualTo(78) ? 'Very High' : probability.greaterThanOrEqualTo(62) ? 'High' : probability.greaterThanOrEqualTo(39) ? 'Medium' : 'Low'
        case 'violence_extended':
            return probability.greaterThanOrEqualTo(73) ? 'Very High' : probability.greaterThanOrEqualTo(60) ? 'High' : probability.greaterThanOrEqualTo(42) ? 'Medium' : 'Low'
    }
    return null
}

export function checkMissingQuestions(params: TestCaseParameters, requiredParams: string[]): { count: number, result: string } {

    const missing: string[] = []
    requiredParams.forEach((param) => {
        if (params[param] == null) {
            const text = missingText[param]
            missing.push(text == undefined ? param : text)
        }
    })
    const result = missing.length == 0 ? `''` : `'${missing.join('\n')}\n'`
    return { count: missing.length, result: result }
}

export const requiredParams = {

    serious_violence_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'AGE_AT_FIRST_SANCTION',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
    ],
    serious_violence_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'AGE_AT_FIRST_SANCTION',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'TWO_POINT_TWO',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
        'AGGRAVATED_BURGLARY',
        'ARSON',
        'CRIMINAL_DAMAGE_LIFE',
        'FIREARMS',
        'GBH',
        'HOMICIDE',
        'KIDNAP',
        'ROBBERY',
        'WEAPONS_NOT_FIREARMS',
    ],
    general_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'AGE_AT_FIRST_SANCTION',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
    ],
    violence_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'AGE_AT_FIRST_SANCTION',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
    ],
    general_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'AGE_AT_FIRST_SANCTION',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'SEVEN_POINT_TWO',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'TWELVE_POINT_ONE',
        'DAILY_DRUG_USER',
        'AMPHETAMINES',
        'BENZODIAZIPINES',
        'CANNABIS',
        'CRACK_COCAINE',
        'ECSTASY',
        'HALLUCINOGENS',
        'HEROIN',
        'KETAMINE',
        'METHADONE',
        'MISUSED_PRESCRIBED',
        'OTHER_DRUGS',
        'OTHER_OPIATE',
        'POWDER_COCAINE',
        'SOLVENTS',
        'SPICE',
        'STEROIDS',
        'EIGHT_POINT_EIGHT',
    ],
    violence_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'AGE_AT_FIRST_SANCTION',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'TWO_POINT_TWO',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'SEVEN_POINT_TWO',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
        'EIGHT_POINT_EIGHT',
    ],
    osp_c: [
        'DOB',
        'TOTAL_SANCTIONS_COUNT',
        'CONTACT_ADULT_SANCTIONS',
        'CONTACT_CHILD_SANCTIONS',
        'INDECENT_IMAGE_SANCTIONS',
        'PARAPHILIA_SANCTIONS',
        'STRANGER_VICTIM',
        'DATE_RECENT_SEXUAL_OFFENCE',

    ],
    osp_i: [
        'GENDER',
        'CONTACT_CHILD_SANCTIONS',
        'INDECENT_IMAGE_SANCTIONS',
        'ONE_POINT_THIRTY',
    ],
}

const missingText = {
    DOB: 'Date of birth',
    LAST_SANCTION_DATE: 'Last Sanction Date',
    AGE_AT_FIRST_SANCTION: 'Age at first sanction',
    GENDER: 'Gender',
    OFFENCE_CODE: 'Offence Code',
    TOTAL_SANCTIONS_COUNT: '1.32 Total number of sanctions for all offences',
    COMMUNITY_DATE: '1.38 Date of commencement of community sentence or earliest possible release from custody',
    TOTAL_VIOLENT_SANCTIONS: '1.40 How many of the total number of sanctions involved violent offences?',
    THREE_POINT_FOUR: '3.4 Is the offender living in suitable accommodation?',
    FOUR_POINT_TWO: '4.2 Is the person unemployed, or will be unemployed on release?',
    SIX_POINT_FOUR: `6.4 What is the person's current relationship with partner?`,
    SIX_POINT_SEVEN: '6.7 Perpetrator of domestic abuse?',
    SIX_POINT_EIGHT: '6.8 Current Relationship Status',
    SEVEN_POINT_TWO: '7.2 Regular activities encourage offending',
    DAILY_DRUG_USER: '8.1 Drugs ever misused (in custody and community)',
    EIGHT_POINT_EIGHT: '8.8 Motivation to tackle drug misuse',
    NINE_POINT_ONE: '9.1 Is current alcohol use a problem',
    NINE_POINT_TWO: '9.2 Binge drinking or excessive use of alcohol in last 6 months',
    ELEVEN_POINT_TWO: '11.2 Impulsivity',
    ELEVEN_POINT_FOUR: '11.4 Temper control',
    TWELVE_POINT_ONE: '12.1 Pro-criminal attitudes',
    HOMICIDE: 'R1.2 Murder / attempted murder / threat or conspiracy to murder / manslaughter',
    GBH: 'R1.2 Wounding / GBH',
    KIDNAP: 'R1.2 Kidnapping / false imprisonment',
    FIREARMS: 'R1.2 Possession of a firearm with intent to endanger life or resist arrest',
    ROBBERY: 'R1.2 Robbery',
    AGGRAVATED_BURGLARY: 'R1.2 Aggravated burglary',
    WEAPONS_NOT_FIREARMS: 'R1.2 Any offence involving possession and / or use of weapons',
    CRIMINAL_DAMAGE_LIFE: 'R1.2 Criminal damage with the intent to endanger life',
    ARSON: 'R1.2 Arson',
    CONTACT_ADULT_SANCTIONS: '1.34 Number of previous/current sanctions involving contact adult sexual/sexually motivated offences',
    CONTACT_CHILD_SANCTIONS: '1.45 Number of previous/current sanctions involving direct contact child sexual/sexually motivated offences',
    PARAPHILIA_SANCTIONS: '1.37 Number of previous/current sanctions involving other non-contact sexual/sexually motivated offences',
    DATE_RECENT_SEXUAL_OFFENCE: '1.33 Date of most recent sanction involving a sexual/sexually motivated offence',
    STRANGER_VICTIM: '1.44 Does the current offence involve actual/attempted direct contact against a victim who was a stranger?',
    INDECENT_IMAGE_SANCTIONS: '1.46 Number of previous/current sanctions involving indecent child image or indirect child contact sexual/sexually motivated offences',
}