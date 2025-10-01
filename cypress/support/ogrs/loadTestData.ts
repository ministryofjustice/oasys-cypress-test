import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as utc from 'dayjs/plugin/utc'
import { Decimal } from 'decimal.js'

import { ExpectedScores, ExpectedScoreValues, TestCaseParameters, OgrsOffenceCat, ScoreType, ScoreBand, OutputParameters } from './types'
import { offences, offenceCats } from './data/offences'
import { dateFormat } from './orgsTest'
import { createOutputObject, getOutputParameterName } from './createOutput'

export function loadParameterSet(parameterLine: string): TestCaseParameters {

    const parameters = parameterLine.split(',')
    let i = 0

    dayjs.extend(customParseFormat)
    dayjs.extend(utc)
    const today = dayjs.utc()

    const p: TestCaseParameters = {
        STATIC_CALC: getString(parameters[i++]),
        DOB: getDate(parameters[i++]),
        GENDER: getString(parameters[i++]),
        OFFENCE_CODE: getString(parameters[i++]),
        TOTAL_SANCTIONS_COUNT: getInteger(parameters[i++]),
        TOTAL_VIOLENT_SANCTIONS: getInteger(parameters[i++]),
        CONTACT_ADULT_SANCTIONS: getInteger(parameters[i++]),
        CONTACT_CHILD_SANCTIONS: getInteger(parameters[i++]),
        INDECENT_IMAGE_SANCTIONS: getInteger(parameters[i++]),
        PARAPHILIA_SANCTIONS: getInteger(parameters[i++]),
        STRANGER_VICTIM: getString(parameters[i++]),
        FIRST_SANCTION_DATE: getDate(parameters[i++]),
        LAST_SANCTION_DATE: getDate(parameters[i++]),
        DATE_RECENT_SEXUAL_OFFENCE: getDate(parameters[i++]),
        MOST_RECENT_OFFENCE: getDate(parameters[i++]),
        COMMUNITY_DATE: getDate(parameters[i++]),
        ONE_POINT_THIRTY: getString(parameters[i++]),
        TWO_POINT_TWO: getInteger(parameters[i++]),
        THREE_POINT_FOUR: getInteger(parameters[i++]),
        FOUR_POINT_TWO: getInteger(parameters[i++]),
        SIX_POINT_FOUR: getInteger(parameters[i++]),
        SIX_POINT_SEVEN: getInteger(parameters[i++]),
        SIX_POINT_EIGHT: getInteger(parameters[i++]),
        SEVEN_POINT_TWO: getInteger(parameters[i++]),
        DAILY_DRUG_USER: getString(parameters[i++]),
        AMPHETAMINES: getString(parameters[i++]),
        BENZODIAZIPINES: getString(parameters[i++]),
        CANNABIS: getString(parameters[i++]),
        CRACK_COCAINE: getString(parameters[i++]),
        ECSTASY: getString(parameters[i++]),
        HALLUCINOGENS: getString(parameters[i++]),
        HEROIN: getString(parameters[i++]),
        KETAMINE: getString(parameters[i++]),
        METHADONE: getString(parameters[i++]),
        MISUSED_PRESCRIBED: getString(parameters[i++]),
        OTHER_DRUGS: getString(parameters[i++]),
        OTHER_OPIATE: getString(parameters[i++]),
        POWDER_COCAINE: getString(parameters[i++]),
        SOLVENTS: getString(parameters[i++]),
        SPICE: getString(parameters[i++]),
        STEROIDS: getString(parameters[i++]),
        EIGHT_POINT_EIGHT: getInteger(parameters[i++]),
        NINE_POINT_ONE: getInteger(parameters[i++]),
        NINE_POINT_TWO: getInteger(parameters[i++]),
        ELEVEN_POINT_TWO: getInteger(parameters[i++]),
        ELEVEN_POINT_FOUR: getInteger(parameters[i++]),
        TWELVE_POINT_ONE: getInteger(parameters[i++]),
        OGRS4G_ALGO_VERSION: getInteger(parameters[i++]),
        OGRS4V_ALGO_VERSION: getInteger(parameters[i++]),
        OGP2_ALGO_VERSION: getInteger(parameters[i++]),
        OVP2_ALGO_VERSION: getInteger(parameters[i++]),
        OSP_ALGO_VERSION: getInteger(parameters[i++]),
        SNSV_ALGO_VERSION: getInteger(parameters[i++]),
        AGGRAVATED_BURGLARY: getInteger(parameters[i++]),
        ARSON: getInteger(parameters[i++]),
        CRIMINAL_DAMAGE_LIFE: getInteger(parameters[i++]),
        FIREARMS: getInteger(parameters[i++]),
        GBH: getInteger(parameters[i++]),
        HOMICIDE: getInteger(parameters[i++]),
        KIDNAP: getInteger(parameters[i++]),
        ROBBERY: getInteger(parameters[i++]),
        WEAPONS_NOT_FIREARMS: getInteger(parameters[i++]),
        CUSTODY_IND: getString(parameters[i++]),
    }

    p.age = getDateDiff(p.DOB, p.COMMUNITY_DATE, 'year')
    p.ageAtFirstSanction = getDateDiff(p.DOB, p.FIRST_SANCTION_DATE, 'year')
    p.ageAtLastSanction = getDateDiff(p.DOB, p.LAST_SANCTION_DATE, 'year')
    p.ageAtLastSanctionSexual = getDateDiff(p.DOB, p.DATE_RECENT_SEXUAL_OFFENCE, 'year')
    p.ofm = getDateDiff(p.COMMUNITY_DATE, today, 'month', true)
    p.offenceCat = getOffenceCat(p.OFFENCE_CODE)
    p.firstSanction = p.TOTAL_SANCTIONS_COUNT == 1
    p.secondSanction = p.TOTAL_SANCTIONS_COUNT == 2
    p.yearsBetweenFirstTwoSanctions = p.secondSanction ? getDateDiff(p.FIRST_SANCTION_DATE, p.LAST_SANCTION_DATE, 'year') : 0
    p.neverSanctionedViolence = p.TOTAL_VIOLENT_SANCTIONS == 0
    p.onceViolent = p.TOTAL_VIOLENT_SANCTIONS == 1
    p.male = p.GENDER == 'M'
    p.female = p.GENDER == 'F'
    p.out5Years = getDateDiff(today, p.COMMUNITY_DATE, 'year') >= 5

    const offenceInLast5Years = getDateDiff(today, p.MOST_RECENT_OFFENCE, 'year')
    p.offenceInLast5Years = offenceInLast5Years == null ? false : offenceInLast5Years < 5
    const sexualOffenceInLast5Years = getDateDiff(today, p.DATE_RECENT_SEXUAL_OFFENCE, 'year')
    p.sexualOffenceInLast5Years = sexualOffenceInLast5Years == null ? false : sexualOffenceInLast5Years < 5

    return p
}

function getString(param: string): string {
    return param == '' || param == null ? null : param
}

function getDate(param: string): dayjs.Dayjs {
    return param == '' || param == null ? null : dayjs.utc(param, dateFormat)
}

function getInteger(param: string): number {
    return param == '' || param == null ? null : Number.parseInt(param)
}

function getNumber(param: string): number {
    return param == '' || param == null ? null : Number.parseFloat(param)
}

function getDateDiff(firstDate: dayjs.Dayjs, secondDate: dayjs.Dayjs, unit: 'year' | 'month', ofm: boolean = false): number {

    if (firstDate == null || secondDate == null) {
        return null
    }
    const diff = secondDate.diff(firstDate, unit)

    if (ofm) {
        return diff < 0 ? 0 : diff > 36 ? 36 : diff
    } else {
        return diff >= 0 ? diff : null
    }

}

function getOffenceCat(offence: string): OgrsOffenceCat {
    const cat = offenceCats[offences[offence]]
    return cat == undefined ? null : cat
}

function getDecimal(param: string): Decimal {

    return param == '' || param == null ? null : new Decimal(param)
}

export function loadExpectedValues(parameterLine: string): ExpectedScores {

    const expectedOutputParameters = createOutputObject()
    const values = parameterLine.split(',')

    for (let i=0;i<outputParameters.length; i++) {
        expectedOutputParameters[outputParameters[i]] = values[i]
    }

    return {
        outputParameters: expectedOutputParameters,
        serious_violence_brief: getScore('serious_violence_brief', expectedOutputParameters),
        serious_violence_extended: getScore('serious_violence_extended', expectedOutputParameters),
        general_brief: getScore('general_brief', expectedOutputParameters),
        violence_brief: getScore('violence_brief', expectedOutputParameters),
        general_extended: getScore('general_extended', expectedOutputParameters),
        violence_extended: getScore('violence_extended', expectedOutputParameters),
        osp_c: getScore('osp_c', expectedOutputParameters),
        osp_i: getScore('osp_i', expectedOutputParameters),
        rsr: getScore('rsr', expectedOutputParameters),
    }
}

function getScore(scoreType: ScoreType, expectedOutputParameters: OutputParameters): ExpectedScoreValues {

    const zScore = expectedOutputParameters[getOutputParameterName(scoreType, 'score')]
    const probability = expectedOutputParameters[getOutputParameterName(scoreType, 'probability')]
    const band = expectedOutputParameters[getOutputParameterName(scoreType, 'band')]

    return { zScore: getDecimal(zScore), probability: getNumber(probability), band: getString(band) as ScoreBand }
}

const outputParameters = [
        'OGRS4G_CALCULATED',
        'OGRS4G_YEAR_TWO',
        'OGRS4G_AAEAD',
        'OGRS4G_FEMALE',
        'OGRS4G_OFFENCE',
        'OGRS4G_FIRST_SANCTION',
        'OGRS4G_SECOND_SANCTION',
        'OGRS4G_TOTAL_SANCTIONS',
        'OGRS4G_SECOND_SANCTION_GAP',
        'OGRS4G_OFM',
        'OGRS4G_COPASG',
        'OGRS4G_COPASG_SQUARED',
        'OGRS4G_SCORE',
        'OGRS4G_PERCENTAGE',
        'OGRS4G_MISSING_QUESTION',
        'OGRS4G_MISSING_COUN',
        'OGRS4V_CALCULATED',
        'OGRS4V_YEAR_TWO',
        'OGRS4V_AAEAD',
        'OGRS4V_FEMALE',
        'OGRS4V_OFFENCE',
        'OGRS4V_FIRST_SANCTION',
        'OGRS4V_SECOND_SANCTION',
        'OGRS4V_TOTAL_SANCTIONS',
        'OGRS4V_SECOND_SANCTION_GAP',
        'OGRS4V_OFM',
        'OGRS4V_NEVER_VIOLENT',
        'OGRS4V_ONCE_VIOLENT',
        'OGRS4V_TOTAL_VIOLENT_SANCTIONS',
        'OGRS4V_COPAS_VIOLENT',
        'OGRS4V_SCORE',
        'OGRS4V_PERCENTAGE',
        'OGRS4V_MISSING_QUESTION',
        'OGRS4V_MISSING_COUN',
        'SNSV_CALCULATED_STATIC',
        'SNSV_YEAR_TWO_STATIC',
        'SNSV_AAEAD_STATIC',
        'SNSV_FEMALE_STATIC',
        'SNSV_OFFENCE_STATIC',
        'SNSV_FIRST_SANCTION_STATIC',
        'SNSV_SECOND_SANCTION_STATIC',
        'SNSV_TOTAL_SANCTIONS_STATIC',
        'SNSV_SECOND_SANCTION_GAP_STATIC',
        'SNSV_OFM_STATIC',
        'SNSV_COPASV_STATIC',
        'SNSV_NEVER_VIOLENT_STATIC',
        'SNSV_ONCE_VIOLENT_STATIC',
        'SNSV_TOTAL_VIOLENT_SANCTIONS_STATIC',
        'SNSV_COPAS_VIOLENT_STATIC',
        'SNSV_TOTAL_SCORE_STATIC',
        'SNSV_PERCENTAGE_STATIC',
        'SNSV_MISSING_QUESTIONS_STATIC',
        'SNSV_MISSING_COUNT_STATIC',
        'OGP2_CALCULATED',
        'OGP2_YEAR_TWO',
        'OGP2_AAEAD',
        'OGP2_FEMALE',
        'OGP2_OFFENCE',
        'OGP2_FIRST_SANCTION',
        'OGP2_SECOND_SANCTION',
        'OGP2_TOTAL_SANCTIONS',
        'OGP2_SECOND_SANCTION_GAP',
        'OGP2_OFM',
        'OGP2_COPASG',
        'OGP2_COPASG_SQUARED',
        'OGP2_SUITABLE_ACC',
        'OGP2_UNEMPLOYED',
        'OGP2_LIVE_IN_RELATIONSHIP',
        'OGP2_RELATIONSHIP',
        'OGP2_MULTIPLICATIVE_RELATIONSHIP',
        'OGP2_DV',
        'OGP2_REGULAR_ACTIVITIES',
        'OGP2_DAILY_DRUG_USER',
        'OGP2_DRUG_MOTIVATION',
        'OGP2_CHRONIC_DRINKER',
        'OGP2_BINGE_DRINKER',
        'OGP2_IMPULSIVE',
        'OGP2_CRIMINAL_ATTITUDE',
        'OGP2_HEROIN',
        'OGP2_METHADONE',
        'OGP2_OTHER_OPIATE',
        'OGP2_CRACK',
        'OGP2_COCAINE',
        'OGP2_MISUSE_PRESCRIBED',
        'OGP2_BENZOS',
        'OGP2_AMPHETAMINES',
        'OGP2_ECSTASY',
        'OGP2_CANNABIS',
        'OGP2_STEROIDS',
        'OGP2_OTHER_DRUGS',
        'OGP2_TOTAL_SCORE',
        'OGP2_PERCENTAGE',
        'OGP2_MISSING_QUESTION',
        'OGP2_MISSING_COUN',
        'OVP2_CALCULATED',
        'OVP2_YEAR_TWO',
        'OVP2_AAEAD',
        'OVP2_FEMALE',
        'OVP2_OFFENCE',
        'OVP2_FIRST_SANCTION',
        'OVP2_SECOND_SANCTION',
        'OVP2_TOTAL_SANCTIONS',
        'OVP2_SECOND_SANCTION_GAP',
        'OVP2_OFM',
        'OVP2_COPASV',
        'OVP2_NEVER_VIOLENT',
        'OVP2_ONCE_VIOLENT',
        'OVP2_TOTAL_VIOLENT_SANCTIONS',
        'OVP2_COPAS_VIOLENT',
        'OVP2_SUITABLE_ACC',
        'OVP2_UNEMPLOYED',
        'OVP2_RELATIONSHIP',
        'OVP2_LIVE_IN_RELATIONSHIP',
        'OVP2_MULTIPLICATIVE_RELATIONSHIP',
        'OVP2_DV',
        'OVP2_REGULAR_ACTIVITIES',
        'OVP2_DRUG_MOTIVATION',
        'OVP2_CHRONIC_DRINKER',
        'OVP2_BINGE_DRINKER',
        'OVP2_IMPULSIVE',
        'OVP2_TEMPER',
        'OVP2_CRIMINAL_ATTITUDE',
        'OVP2_HEROIN',
        'OVP2_CRACK',
        'OVP2_COCAINE',
        'OVP2_MISUSE_PRESCRIBED',
        'OVP2_BENZOS',
        'OVP2_AMPHETAMINES',
        'OVP2_ECSTASY',
        'OVP2_CANNABIS',
        'OVP2_STEROIDS',
        'OVP2_TOTAL_SCORE',
        'OVP2_PERCENTAGE',
        'OVP2_MISSING_QUESTION',
        'OVP2_MISSING_COUN',
        'SNSV_CALCULATED_DYNAMIC',
        'SNSV_YEAR_TWO_DYNAMIC',
        'SNSV_AAEAD_DYNAMIC',
        'SNSV_FEMALE_DYNAMIC',
        'SNSV_OFFENCE_DYNAMIC',
        'SNSV_FIRST_SANCTION_DYNAMIC',
        'SNSV_SECOND_SANCTION_DYNAMIC',
        'SNSV_TOTAL_SANCTIONS_DYNAMIC',
        'SNSV_SECOND_SANCTION_GAP_DYNAMIC',
        'SNSV_OFM_DYNAMIC',
        'SNSV_COPASV_DYNAMIC',
        'SNSV_NEVER_VIOLENT_DYNAMIC',
        'SNSV_ONCE_VIOLENT_DYNAMIC',
        'SNSV_TOTAL_VIOLENT_SANCTIONS_DYNAMIC',
        'SNSV_COPAS_VIOLENT_DYNAMIC',
        'SNSV_WEAPON_DYNAMIC',
        'SNSV_SUITABLE_ACC_DYNAMIC',
        'SNSV_UNEMPLOYED_DYNAMIC',
        'SNSV_RELATIONSHIP_QUALITY_DYNAMIC',
        'SNSV_DV_DYNAMIC',
        'SNSV_CHRONIC_DRINKER_DYNAMIC',
        'SNSV_BINGE_DRINKER_DYNAMIC',
        'SNSV_IMPULSIVE_DYNAMIC',
        'SNSV_TEMPER_DYNAMIC',
        'SNSV_CRIMINAL_ATTITUDE_DYNAMIC',
        'SNSV_HOMICIDE_DYNAMIC',
        'SNSV_GBH_DYNAMIC',
        'SNSV_KIDNAP_DYNAMIC',
        'SNSV_FIREARMS_DYNAMIC',
        'SNSV_ROBBERY_DYNAMIC',
        'SNSV_AGGRAVATED_BURGLARY_DYNAMIC',
        'SNSV_WEAPONS_NOT_FIREARMS_DYNAMIC',
        'SNSV_CRIMINAL_DAMAGE_LIFE_DYNAMIC',
        'SNSV_ARSON_DYNAMIC',
        'SNSV_TOTAL_SCORE_DYNAMIC',
        'SNSV_PERCENTAGE_DYNAMIC',
        'SNSV_MISSING_QUESTIONS_DYNAMIC',
        'SNSV_MISSING_COUNT_DYNAMIC',
        'OSP_DC_CALCULATED',
        'OSP_DC_SCORE',
        'OSP_DC_PERCENTAGE',
        'OSP_DC_BAN',
        'OSP_DC_RISK_REDUCTION',
        'OSP_IIC_CALCULATED',
        'OSP_IIC_SCORE',
        'OSP_IIC_PERCENTAGE',
        'OSP_IIC_BAN',
        'RSR_PERCENTAGE',
        'RSR_BAN',
        'RSR_CALCULATED',
        'RSR_MISSING_QUESTION',
        'RSR_MISSING_COUNT',
]