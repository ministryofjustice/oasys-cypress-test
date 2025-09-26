import * as fs from 'fs-extra'
import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as utc from 'dayjs/plugin/utc'
import { Decimal } from 'decimal.js'

import { OrgsOffenceCat, offences, offenceCats } from './data/offences'
import { calculateAssessment } from './ogrsCalculator'

const dataFilePath = './cypress/support/ogrs/data/'
const headers = true
const dateFormat = 'DD-MMM-YYYY'


export type OgrsTestParameters = { dataFile: string, resultsFile: string, tolerance: string }

export type ScoreBand = 'Low' | 'Medium' | 'High' | 'Very High'

export type OgrsTestScriptResult = {
    assessmentResults: TestCaseResult[],
    failed: boolean,
}

export type TestCaseResult = {
    serious_violence_brief?: ScoreResult,
    serious_violence_extended?: ScoreResult,
    general_brief?: ScoreResult,
    violence_brief?: ScoreResult,
    general_extended?: ScoreResult,
    violence_extended?: ScoreResult,
    osp_c?: ScoreResult,
    osp_i?: ScoreResult,
    logText: string[],
    failed: boolean,
}

export type ScoreResult = {
    zScore: Decimal,
    probability: Decimal,
    band: ScoreBand,
    logText: string[],
    diff?: Decimal,
    failed?: boolean,
}

export type ExpectedScoreValues = {
    zScore: Decimal,
    probability?: Decimal,
    band?: ScoreBand,
}

export type ExpectedScores = {
    serious_violence_brief: ExpectedScoreValues,
    serious_violence_extended: ExpectedScoreValues,
    general_brief: ExpectedScoreValues,
    violence_brief: ExpectedScoreValues,
    general_extended: ExpectedScoreValues,
    violence_extended: ExpectedScoreValues,
    osp_c: ExpectedScoreValues,
    osp_i: ExpectedScoreValues,
}

export async function ogrsTest(parameters: OgrsTestParameters): Promise<OgrsTestScriptResult> {

    const dataSet = await fs.readFile(`${dataFilePath}${parameters.dataFile}.csv`, 'utf8')
    const assessments = dataSet.split('\r\n')
    const expectedResultsSet = await fs.readFile(`${dataFilePath}${parameters.resultsFile}.csv`, 'utf8')
    const expectedResults = expectedResultsSet.split('\r\n')

    const results: TestCaseResult[] = []

    let failed = false

    for (let i = headers ? 1 : 0; i < assessments.length; i++) {
        const assessmentResult = calculateAssessment(loadParameterSet(assessments[i]), loadExpectedValues(expectedResults[i]), parameters.tolerance, i.toString())
        results.push(assessmentResult)
        if (assessmentResult.failed) {
            failed = true
        }
    }

    return { assessmentResults: results, failed: failed }
}


export type TestCaseParameters = {
    STATIC_CALC: string,
    DOB: dayjs.Dayjs,
    GENDER: string,
    OFFENCE_CODE: string,
    TOTAL_SANCTIONS_COUNT: number,
    TOTAL_VIOLENT_SANCTIONS: number,
    CONTACT_ADULT_SANCTIONS: number,
    CONTACT_CHILD_SANCTIONS: number,
    INDECENT_IMAGE_SANCTIONS: number,
    PARAPHILIA_SANCTIONS: number,
    STRANGER_VICTIM: string,
    FIRST_SANCTION_DATE: dayjs.Dayjs,
    LAST_SANCTION_DATE: dayjs.Dayjs,
    DATE_RECENT_SEXUAL_OFFENCE: dayjs.Dayjs,
    MOST_RECENT_OFFENCE: dayjs.Dayjs,
    COMMUNITY_DATE: dayjs.Dayjs,
    ONE_POINT_THIRTY: string,
    TWO_POINT_TWO: number,
    THREE_POINT_FOUR: number,
    FOUR_POINT_TWO: number,
    SIX_POINT_FOUR: number,
    SIX_POINT_SEVEN: number,
    SIX_POINT_EIGHT: number,
    SEVEN_POINT_TWO: number,
    DAILY_DRUG_USER: string,
    AMPHETAMINES: string,
    BENZODIAZIPINES: string,
    CANNABIS: string,
    CRACK_COCAINE: string,
    ECSTASY: string,
    HALLUCINOGENS: string,
    HEROIN: string,
    KETAMINE: string,
    METHADONE: string,
    MISUSED_PRESCRIBED: string,
    OTHER_DRUGS: string,
    OTHER_OPIATE: string,
    POWDER_COCAINE: string,
    SOLVENTS: string,
    SPICE: string,
    STEROIDS: string,
    EIGHT_POINT_EIGHT: number,
    NINE_POINT_ONE: number,
    NINE_POINT_TWO: number,
    ELEVEN_POINT_TWO: number,
    ELEVEN_POINT_FOUR: number,
    TWELVE_POINT_ONE: number,
    OGRS4G_ALGO_VERSION: number,
    OGRS4V_ALGO_VERSION: number,
    OSP_ALGO_VERSION: number,
    SNSV_ALGO_VERSION: number,
    AGGRAVATED_BURGLARY: number,
    ARSON: number,
    CRIMINAL_DAMAGE_LIFE: number,
    FIREARMS: number,
    GBH: number,
    HOMICIDE: number,
    KIDNAP: number,
    ROBBERY: number,
    WEAPONS_NOT_FIREARMS: number,
    CUSTODY_IND: string,
    age?: number,
    ageAtFirstSanction?: number,
    ageAtLastSanction?: number,
    ageAtLastSanctionSexual?: number,
    yearsBetweenFirstTwoSanctions?: number,
    ofm?: number,
    offenceCat?: OrgsOffenceCat,
    firstSanction?: boolean,
    secondSanction?: boolean,
    neverSanctionedViolence?: boolean,
    onceViolent?: boolean,
    male?: boolean,
    female?: boolean,
}

function loadParameterSet(parameterLine: string): TestCaseParameters {

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
    p.yearsBetweenFirstTwoSanctions = getDateDiff(p.FIRST_SANCTION_DATE, p.LAST_SANCTION_DATE, 'year')
    p.ofm = getDateDiff(p.COMMUNITY_DATE, today, 'month', true)
    p.offenceCat = getOffenceCat(p.OFFENCE_CODE)
    p.firstSanction = p.TOTAL_SANCTIONS_COUNT == 1
    p.secondSanction = p.TOTAL_SANCTIONS_COUNT == 2
    p.neverSanctionedViolence = p.TOTAL_VIOLENT_SANCTIONS == 0
    p.onceViolent = p.TOTAL_VIOLENT_SANCTIONS == 1
    p.male = p.GENDER == 'M'
    p.female = p.GENDER == 'F'

    return p
}

function getString(param: string): string {
    return param == '' ? null : param
}

function getDate(param: string): dayjs.Dayjs {
    return param == '' ? null : dayjs.utc(param, dateFormat)
}

function getInteger(param: string): number {
    return param == '' ? null : Number.parseInt(param)
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

function getOffenceCat(offence: string): OrgsOffenceCat {
// TODO error handling
    const cat = offenceCats[offences[offence]]
    return cat == undefined ? null : cat
}

function getDecimal(param: string): Decimal {

    return param == '' ? null : new Decimal(param)
}

function loadExpectedValues(parameterLine: string): ExpectedScores {

    const values = parameterLine.split(',')
    let i = 0
    const resultSet: ExpectedScores = {
        serious_violence_brief: { zScore: getDecimal(values[i++]) },
        serious_violence_extended: { zScore: getDecimal(values[i++]) },
        general_brief: { zScore: getDecimal(values[i++]) },
        violence_brief: { zScore: getDecimal(values[i++]) },
        general_extended: { zScore: getDecimal(values[i++]) },
        violence_extended: { zScore: getDecimal(values[i++]) },
        osp_c: { zScore: getDecimal(values[i++]) },
        osp_i: { zScore: getDecimal(values[i++]) },
    }

    return resultSet
}

export const requiredParams = {

    serious_violence_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'offenceCat',
    ],
    serious_violence_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
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
        'offenceCat',
    ],
    general_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'offenceCat',
    ],
    violence_brief: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
        'LAST_SANCTION_DATE',
        'COMMUNITY_DATE',
        'offenceCat',
    ],
    general_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'FIRST_SANCTION_DATE',
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
        'offenceCat',
    ],
    violence_extended: [
        'DOB',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'TOTAL_VIOLENT_SANCTIONS',
        'FIRST_SANCTION_DATE',
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
        'EIGHT_POINT_EIGHT',
        'offenceCat',
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