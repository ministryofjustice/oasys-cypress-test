import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import { OgrsOffenceCat, TestCaseParameters } from '../types'
import { OgrsRsr } from './dbClasses'
import { dateFormat } from '../orgsTest'
import { offenceCats, offences } from '../data/offences'
import { addCalculatedInputParameters } from '../loadTestData'

export function createRsrTestCase(rsr: OgrsRsr): TestCaseParameters {

    dayjs.extend(customParseFormat)
    dayjs.extend(utc)
    const today = dayjs.utc()

    const p: TestCaseParameters = {
        ASSESSMENT_DATE: today,
        STATIC_CALC: 'N',
        DOB: getDate(rsr.dob),
        GENDER: lookupValue(rsr.gender, genderLookup),
        OFFENCE_CODE: rsr.offence,
        TOTAL_SANCTIONS_COUNT: rsr.s1_32_total_sanctions,
        TOTAL_VIOLENT_SANCTIONS: rsr.s1_40_violent_sanctions,
        CONTACT_ADULT_SANCTIONS: rsr.s1_34_contact_adult_score,
        CONTACT_CHILD_SANCTIONS: rsr.s1_45_dc_child_score,
        INDECENT_IMAGE_SANCTIONS: rsr.s1_46_iic_child_score,
        PARAPHILIA_SANCTIONS: rsr.s1_37_non_contact_score,
        STRANGER_VICTIM: rsr.s1_44_dc_stranger_victim,
        AGE_AT_FIRST_SANCTION: rsr.s1_8_age_at_first_sanction,
        LAST_SANCTION_DATE: getDate(rsr.s1_29_date_current_conviction),
        DATE_RECENT_SEXUAL_OFFENCE: getDate(rsr.s1_33_date_recent_sex_offence),
        CURR_SEX_OFF_MOTIVATION: rsr.s1_41_current_sexual_mot,
        MOST_RECENT_OFFENCE: getDate(rsr.s1_43_last_offence_date),
        COMMUNITY_DATE: getDate(rsr.s1_38_community_date),
        ONE_POINT_THIRTY: lookupValue(rsr.s1_30_sexual_element, ynLookup),
        TWO_POINT_TWO: getNumericAnswer(rsr.s2_2_weapon),
        THREE_POINT_FOUR: getNumericAnswer(rsr.s3_q4_suitable_accom),
        FOUR_POINT_TWO: getNumericAnswer(rsr.s4_q2_unemployed),
        SIX_POINT_FOUR: getNumericAnswer(rsr.s6_q4_partner_relationship),
        SIX_POINT_SEVEN: da(rsr),
        SIX_POINT_EIGHT: getNumericAnswer(rsr.s6_q8_cur_rel_status),
        SEVEN_POINT_TWO: getNumericAnswer(rsr.s7_q2_reg_activities),
        DAILY_DRUG_USER: 'N',
        AMPHETAMINES: 'N',
        BENZODIAZIPINES: 'N',
        CANNABIS: 'N',
        CRACK_COCAINE: 'N',
        ECSTASY: 'N',
        HALLUCINOGENS: 'N',
        HEROIN: 'N',
        KETAMINE: 'N',
        METHADONE: 'N',
        MISUSED_PRESCRIBED: 'N',
        OTHER_DRUGS: 'N',
        OTHER_OPIATE: 'N',
        POWDER_COCAINE: 'N',
        SOLVENTS: 'N',
        SPICE: 'N',
        STEROIDS: 'N',
        EIGHT_POINT_EIGHT: 0,
        NINE_POINT_ONE: getNumericAnswer(rsr.s9_q1_alcohol),
        NINE_POINT_TWO: getNumericAnswer(rsr.s9_q2_binge_drink),
        ELEVEN_POINT_TWO: getNumericAnswer(rsr.s11_q2_impulsivity),
        ELEVEN_POINT_FOUR: getNumericAnswer(rsr.s11_q4_temper_control),
        TWELVE_POINT_ONE: 0,
        OGRS4G_ALGO_VERSION: 1,
        OGRS4V_ALGO_VERSION: 1,
        OGP2_ALGO_VERSION: 1,
        OVP2_ALGO_VERSION: 1,
        OSP_ALGO_VERSION: 6,
        SNSV_ALGO_VERSION: 1,
        AGGRAVATED_BURGLARY: getNumericAnswer(rsr.r1_2_past_aggr_burglary),
        ARSON: getNumericAnswer(rsr.r1_2_past_arson),
        CRIMINAL_DAMAGE_LIFE: getNumericAnswer(rsr.r1_2_past_cd_life),
        FIREARMS: getNumericAnswer(rsr.r1_2_past_firearm),
        GBH: getNumericAnswer(rsr.r1_2_past_wounding_gbh),
        HOMICIDE: getNumericAnswer(rsr.r1_2_past_murder),
        KIDNAP: getNumericAnswer(rsr.r1_2_past_kidnapping),
        ROBBERY: getNumericAnswer(rsr.r1_2_past_robbery),
        WEAPONS_NOT_FIREARMS: getNumericAnswer(rsr.r1_2_past_weapon),
        CUSTODY_IND: rsr.prison_ind == 'C' ? 'Y' : 'N',
    }

    addCalculatedInputParameters(p)
    return p
}

function getString(param: string): string {
    return param == '' || param == null ? null : param
}

function getDate(param: string): dayjs.Dayjs {

    const result = dayjs.utc(param, dateFormat)
    return !result.isValid() ? null : result
}

function getNumericAnswer(value: string): number {

    return !value ? null : value == 'YES' ? 1 : value == 'NO' || value == 'NA' ? 0 : value == 'M' ? null : Number.parseInt(value)
}

function da(rsr: OgrsRsr): number {

    const q67 = getNumericAnswer(rsr.s6_q7_dom_abuse)
    return q67 == 1 ? getNumericAnswer(rsr.s6_q7_perpetrator_partner) : q67
}

// function dailyDrugs(data: string[][]): string {

//     const q81 = getSingleAnswer(data, '8', '8.1', ynLookup)
//     return q81 == 'Y' ? checkForDailyDrugs(data) : q81
// }

// function checkForDailyDrugs(data: string[][]): string {

//     let result = 'N'
//     const drugs = getDrugsUsage(data)
//     Object.keys(drugs).forEach((key) => {
//         if (drugs[key] = '100') {
//             result = 'Y'
//         }
//     })

//     return result
// }

// function q88(data: string[][]): number {

//     const q81 = getNumericAnswer(data, '8', '8.1')
//     return q81 == 1 ? getNumericAnswer(data, '8', '8.8') : q81
// }

// function getDrugUsed(data: string[][], drug: string): string {

//     const drugs = getDrugsUsage(data)
//     return drugs[drug] == null ? null : 'Y'
// }

// function getDrugsUsage(data: string[][]): {} {

//     return {
//         HEROIN: getSingleAnswer(data, '8', '8.2.1.1'),
//         ECSTASY: getSingleAnswer(data, '8', '8.2.10.1'),
//         CANNABIS: getSingleAnswer(data, '8', '8.2.11.1'),
//         SOLVENTS: getSingleAnswer(data, '8', '8.2.12.1'),
//         STEROIDS: getSingleAnswer(data, '8', '8.2.13.1'),
//         SPICE: getSingleAnswer(data, '8', '8.2.15.1'),
//         OTHER_DRUGS: getSingleAnswer(data, '8', '8.2.14.1'),
//         METHADONE: getSingleAnswer(data, '8', '8.2.2.1'),
//         OTHER_OPIATE: getSingleAnswer(data, '8', '8.2.3.1'),
//         CRACK_COCAINE: getSingleAnswer(data, '8', '8.2.4.1'),
//         POWDER_COCAINE: getSingleAnswer(data, '8', '8.2.5.1'),
//         MISUSED_PRESCRIBED: getSingleAnswer(data, '8', '8.2.6.1'),
//         BENZODIAZIPINES: getSingleAnswer(data, '8', '8.2.7.1'),
//         AMPHETAMINES: getSingleAnswer(data, '8', '8.2.8.1'),
//         HALLUCINOGENS: getSingleAnswer(data, '8', '8.2.9.1'),
//         KETAMINE: getSingleAnswer(data, '8', '8.2.16.1'),
//     }

// }

function lookupValue(value: string, lookup: {}): string {

    const result = lookup[value]
    return result == undefined ? value : result
}

const genderLookup = {
    0: 'N',
    1: 'M',
    2: 'F',
    3: 'O',
    9: 'U',
}

const ynLookup = {
    YES: 'Y',
    NO: 'N',
}