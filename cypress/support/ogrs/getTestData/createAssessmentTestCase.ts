import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as utc from 'dayjs/plugin/utc'

import { OgrsOffenceCat, TestCaseParameters } from '../types'
import { OgrsAssessment } from './dbClasses'
import { dateFormat } from '../orgsTest'
import { offenceCats, offences } from '../data/offences'
import { addCalculatedInputParameters } from '../loadTestData'

export function createAssessmentTestCase(assessment: OgrsAssessment): TestCaseParameters {

    dayjs.extend(customParseFormat)
    dayjs.extend(utc)
    const today = dayjs.utc()

    let staticCalc = 'N'
    if (assessment.type == 'LAYER1' && assessment.version == 2) {  // RoSHA - set static flag according to 1.39 (offender interview)
        if (getSingleAnswer(assessment.qaData, '1', '1.39') != 'YES') {
            staticCalc = 'Y'
        }
    }

    const p: TestCaseParameters = {
        ASSESSMENT_DATE: today, // TODO is this right?
        STATIC_CALC: staticCalc,
        DOB: getDate(assessment.dob),
        GENDER: lookupValue(assessment.gender, genderLookup),
        OFFENCE_CODE: getString(assessment.offence),
        TOTAL_SANCTIONS_COUNT: getNumericAnswer(assessment.textData, '1', '1.32'),
        TOTAL_VIOLENT_SANCTIONS: getNumericAnswer(assessment.textData, '1', '1.40'),
        CONTACT_ADULT_SANCTIONS: getNumericAnswer(assessment.textData, '1', '1.34'),
        CONTACT_CHILD_SANCTIONS: getNumericAnswer(assessment.textData, '1', '1.45'),
        INDECENT_IMAGE_SANCTIONS: getNumericAnswer(assessment.textData, '1', '1.46'),
        PARAPHILIA_SANCTIONS: getNumericAnswer(assessment.textData, '1', '1.37'),
        STRANGER_VICTIM: getSingleAnswer(assessment.qaData, '1', '1.44', ynLookup),
        AGE_AT_FIRST_SANCTION: getNumericAnswer(assessment.textData, '1', '1.8'),
        LAST_SANCTION_DATE: getDate(getTextAnswer(assessment.textData, '1', '1.29')),
        DATE_RECENT_SEXUAL_OFFENCE: getDate(getTextAnswer(assessment.textData, '1', '1.33')),
        CURR_SEX_OFF_MOTIVATION: getSingleAnswer(assessment.qaData, '1', '1.41', ynLookup),
        MOST_RECENT_OFFENCE: getDate(getTextAnswer(assessment.textData, '1', '1.43')),
        COMMUNITY_DATE: getDate(getTextAnswer(assessment.textData, '1', '1.38')),
        ONE_POINT_THIRTY: getSingleAnswer(assessment.qaData, '1', '1.30', ynLookup),
        TWO_POINT_TWO: getNumericAnswer(assessment.qaData, '2', '2.2_V2_WEAPON'),
        THREE_POINT_FOUR: getNumericAnswer(assessment.qaData, '3', '3.4'),
        FOUR_POINT_TWO: getNumericAnswer(assessment.qaData, '4', '4.2'),
        SIX_POINT_FOUR: getNumericAnswer(assessment.qaData, '6', '6.4'),
        SIX_POINT_SEVEN: da(assessment.qaData),
        SIX_POINT_EIGHT: getNumericAnswer(assessment.qaData, '6', '6.8'),
        SEVEN_POINT_TWO: getNumericAnswer(assessment.qaData, '7', '7.2'),
        DAILY_DRUG_USER: dailyDrugs(assessment.qaData),
        AMPHETAMINES: getDrugUsed(assessment.qaData, 'AMPHETAMINES'),
        BENZODIAZIPINES: getDrugUsed(assessment.qaData, 'BENZODIAZIPINES'),
        CANNABIS: getDrugUsed(assessment.qaData, 'CANNABIS'),
        CRACK_COCAINE: getDrugUsed(assessment.qaData, 'CRACK_COCAINE'),
        ECSTASY: getDrugUsed(assessment.qaData, 'ECSTASY'),
        HALLUCINOGENS: getDrugUsed(assessment.qaData, 'HALLUCINOGENS'),
        HEROIN: getDrugUsed(assessment.qaData, 'HEROIN'),
        KETAMINE: getDrugUsed(assessment.qaData, 'KETAMINE'),
        METHADONE: getDrugUsed(assessment.qaData, 'METHADONE'),
        MISUSED_PRESCRIBED: getDrugUsed(assessment.qaData, 'MISUSED_PRESCRIBED'),
        OTHER_DRUGS: getDrugUsed(assessment.qaData, 'OTHER_DRUGS'),
        OTHER_OPIATE: getDrugUsed(assessment.qaData, 'OTHER_OPIATE'),
        POWDER_COCAINE: getDrugUsed(assessment.qaData, 'POWDER_COCAINE'),
        SOLVENTS: getDrugUsed(assessment.qaData, 'SOLVENTS'),
        SPICE: getDrugUsed(assessment.qaData, 'SPICE'),
        STEROIDS: getDrugUsed(assessment.qaData, 'STEROIDS'),
        EIGHT_POINT_EIGHT: q88(assessment.qaData),
        NINE_POINT_ONE: getNumericAnswer(assessment.qaData, '9', '9.1'),
        NINE_POINT_TWO: getNumericAnswer(assessment.qaData, '9', '9.2'),
        ELEVEN_POINT_TWO: getNumericAnswer(assessment.qaData, '11', '11.2'),
        ELEVEN_POINT_FOUR: getNumericAnswer(assessment.qaData, '11', '11.4'),
        TWELVE_POINT_ONE: getNumericAnswer(assessment.qaData, '12', '12.1'),
        OGRS4G_ALGO_VERSION: 1,
        OGRS4V_ALGO_VERSION: 1,
        OGP2_ALGO_VERSION: 1,
        OVP2_ALGO_VERSION: 1,
        OSP_ALGO_VERSION: 6,
        SNSV_ALGO_VERSION: 1,
        AGGRAVATED_BURGLARY: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.6.2_V2'),
        ARSON: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.7.2_V2'),
        CRIMINAL_DAMAGE_LIFE: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.8.2_V2'),
        FIREARMS: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.10.2_V2'),
        GBH: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.2.2_V2'),
        HOMICIDE: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.1.2_V2'),
        KIDNAP: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.9.2_V2'),
        ROBBERY: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.12.2_V2'),
        WEAPONS_NOT_FIREARMS: getNumericAnswer(assessment.qaData, 'ROSH', 'R1.2.13.2_V2'),
        CUSTODY_IND: getString(assessment.prisonInd) == 'C' ? 'Y' : 'N',
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

function getSingleAnswer(data: string[][], section: string, question: string, lookupDictionary: {} = {}): string {

    if (data == undefined || data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question)
    if (answers.length > 0) {
        return lookupValue(answers[0][2], lookupDictionary)
    }
    return null
}

function getNumericAnswer(data: string[][], section: string, question: string): number {

    if (data == undefined) return null
    if (data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question && a[4] != 'Y')

    if (answers.length > 0) {
        const answer = answers[0][2] == null ? answers[0][3] : answers[0][2]
        return answer == null ? null : answer == 'YES' ? 1 : answer == 'NO' || answer == 'NA' ? 0 : answer == 'M' ? null : Number.parseInt(answer)
    }
    return null
}

function getTextAnswer(data: string[][], section: string, question: string): string {

    if (data == undefined) return undefined
    if (data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question && a[4] != 'Y')  // Check for currently hidden
    if (answers.length > 0) {
        return answers[0][3] == null ? answers[0][2] : answers[0][3]
    }
    return null
}

function da(data: string[][]): number {

    const q67 = getNumericAnswer(data, '6', '6.7da')
    return q67 == 1 ? getNumericAnswer(data, '6', '6.7.2.1da') : q67
}

function dailyDrugs(data: string[][]): string {

    const q81 = getSingleAnswer(data, '8', '8.1', ynLookup)
    return q81 == 'Y' ? checkForDailyDrugs(data) : q81
}

function checkForDailyDrugs(data: string[][]): string {

    let result = 'N'
    const drugs = getDrugsUsage(data)
    Object.keys(drugs).forEach((key) => {
        if (drugs[key] = '100') {
            result = 'Y'
        }
    })

    return result
}

function q88(data: string[][]): number {

    const q81 = getNumericAnswer(data, '8', '8.1')
    return q81 == 1 ? getNumericAnswer(data, '8', '8.8') : q81
}

function getDrugUsed(data: string[][], drug: string): string {

    const drugs = getDrugsUsage(data)
    return drugs[drug] == null ? null : 'Y'
}

function getDrugsUsage(data: string[][]): {} {

    return {
        HEROIN: getSingleAnswer(data, '8', '8.2.1.1'),
        ECSTASY: getSingleAnswer(data, '8', '8.2.10.1'),
        CANNABIS: getSingleAnswer(data, '8', '8.2.11.1'),
        SOLVENTS: getSingleAnswer(data, '8', '8.2.12.1'),
        STEROIDS: getSingleAnswer(data, '8', '8.2.13.1'),
        SPICE: getSingleAnswer(data, '8', '8.2.15.1'),
        OTHER_DRUGS: getSingleAnswer(data, '8', '8.2.14.1'),
        METHADONE: getSingleAnswer(data, '8', '8.2.2.1'),
        OTHER_OPIATE: getSingleAnswer(data, '8', '8.2.3.1'),
        CRACK_COCAINE: getSingleAnswer(data, '8', '8.2.4.1'),
        POWDER_COCAINE: getSingleAnswer(data, '8', '8.2.5.1'),
        MISUSED_PRESCRIBED: getSingleAnswer(data, '8', '8.2.6.1'),
        BENZODIAZIPINES: getSingleAnswer(data, '8', '8.2.7.1'),
        AMPHETAMINES: getSingleAnswer(data, '8', '8.2.8.1'),
        HALLUCINOGENS: getSingleAnswer(data, '8', '8.2.9.1'),
        KETAMINE: getSingleAnswer(data, '8', '8.2.16.1'),
    }

}

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