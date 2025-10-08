import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as utc from 'dayjs/plugin/utc'
import { Decimal } from 'decimal.js'

import { TestCaseParameters, OgrsOffenceCat, ScoreType, ScoreBand, OutputParameters } from './types'
import { offences, offenceCats } from './data/offences'
import { dateFormat } from './orgsTest'
import { createOutputObject } from './createOutput'

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
        AGE_AT_FIRST_SANCTION: getInteger(parameters[i++]),
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
    p.ageAtLastSanction = getDateDiff(p.DOB, p.LAST_SANCTION_DATE, 'year')
    p.ageAtLastSanctionSexual = getDateDiff(p.DOB, p.DATE_RECENT_SEXUAL_OFFENCE, 'year')
    p.ofm = getDateDiff(p.COMMUNITY_DATE, today, 'month', true)
    p.offenceCat = getOffenceCat(p.OFFENCE_CODE)
    p.firstSanction = p.TOTAL_SANCTIONS_COUNT == 1
    p.secondSanction = p.TOTAL_SANCTIONS_COUNT == 2
    p.yearsBetweenFirstTwoSanctions = p.secondSanction ? p.ageAtLastSanction - p.AGE_AT_FIRST_SANCTION : 0
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

    const result = dayjs.utc(param, dateFormat)
    return !result.isValid() ? null : result
}

function getInteger(param: string): number {
    return param == '' || param == null ? null : Number.parseInt(param)
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

export function loadExpectedValues(values: string[]): OutputParameters {

    const expectedOutputParameters = createOutputObject()

    let i = 0
    Object.keys(expectedOutputParameters).forEach((param) => {
        const stringValue = values[i++]
        const isNumeric = !Number.isNaN(Number.parseFloat(stringValue))
        expectedOutputParameters[param] =  isNumeric ? new Decimal(stringValue) : stringValue == '' ? null : stringValue
    })

    return expectedOutputParameters
}