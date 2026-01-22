import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import * as dbClasses from './dbClasses'
import { dateFormat } from '../ogrs/orgsTest'

export const releaseDate6_35 = '2022-06-10T09:06:29'
export const releaseDate6_30 = '2021-10-18T11:12:54'
export const releaseDate6_20 = '2020-06-24T14:21:00'

/**
 * Base class for all API endpoints, defining the response data that is common to all.
 * 
 * This module also includes some common utility functions.
 */
export class EndpointResponse {

    source = 'OASys'
    inputs: object = {}
    crn: string
    limitedAccessOffender: boolean
    probNumber: string
    'crn-deprecated': string = '** DEPRECATION WARNING ** migrate to probNumber / prisNumber'
    pnc: string
    forename: string
    familyName: string
    gender: number
    custodyInd: string

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        Object.keys(parameters).forEach((key) => {
            if (key != 'endpoint') {
                this.inputs[key] = parameters[key]
            }
        })
        this.crn = offenderData.probationCrn
        this.probNumber = this.crn
        this.limitedAccessOffender = offenderData.limitedAccessOffender
        this.pnc = offenderData.pnc
        this.forename = offenderData.forename1
        this.familyName = offenderData.surname
        this.gender = offenderData.gender
        this.custodyInd = offenderData.custodyInd
    }

}


/**
 * Return a single answer from the expected column in a 2-D array, the first column contains the question code.
 * Other columns contain answer code, free-format answer and additional note.
 * 
 * An optional dictionary can be provided to translate answer codes.
 */
export function getSingleAnswer(data: string[][], section: string, question: string, lookupDictionary: { [keys: string]: string } = {}): string {

    if (data == undefined || data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question)
    if (answers.length > 0) {
        return transformValue(answers[0][2], lookupDictionary)
    }
    return null
}

/**
 * Similar to the above, but returns an array of multiple answers that match an input array of possible question codes.
 */
export function getMultipleAnswers(data: string[][], section: string, questions: string[], resultColumn: number, lookupDictionary: { [keys: string]: string } = {}): string[] {

    if (data == undefined) return null

    let result: string[] = null
    const answers = data.filter((a) => a[0] == section && questions.includes(a[1]) && a[2] != 'No' && a[2] != null)

    if (answers.length > 0) {
        result = []
        answers.forEach((a) => {
            let answer = transformValue(a[resultColumn], lookupDictionary)
            if (answer != null) {
                result.push(answer)
            }
        })
    }

    return result?.length == 0 ? null : result
}

/**
 * Return a single answer from the expected column in a 2-D array, the first column contains the question code.
 * Other columns contain free-format answer and additional note, plus currently_hidden_ind.
 */
export function getTextAnswer(data: string[][], section: string, question: string, answerType: 'freeformat' | 'additionalNote' = null): string {

    if (data == undefined) return undefined
    if (data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question)
    if (answers.length > 0) {
        if (answerType == null) {
            return answers[0][3] == null ? answers[0][2] : answers[0][3]
        } else {
            return answerType == 'freeformat' ? answers[0][2] : answers[0][3]
        }
    }
    return undefined
}

/**
 * Similar to the above but converts string to score, e.g. '0-No problems' to 0.  M (missing) is returned as null returned as null
 */
export function getSingleAnswerAsScore(data: string[][], section: string, question: string): number {

    if (data == undefined || data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question)
    if (answers.length > 0) {
        if (answers[0][2] != null) {
            const c = answers[0][2].substring(0, 1)
            return Number.isNaN(Number.parseInt(c)) ? null : Number.parseInt(c)
        }
    }
    return null
}

/**
 * As above, but reformats the text into the required date format.
 */
export function getReformattedDateAnswer(data: string[][], section: string, question: string): string {

    if (data == undefined) return undefined
    if (data == null) return ''

    let dateString = getTextAnswer(data, section, question)

    dayjs.extend(customParseFormat)
    let date = dayjs(dateString, 'DD/MM/YYYY')
    return date.isValid() ? date.format('YYYY-MM-DD') : ''
}

/**
 * Return a single answer from the expected column in a 2-D array, the first column contains the question code.
 * Other columns contain answer code, free-format answer and additional note.
 */
export function getNumericAnswer(data: string[][], section: string, question: string): number {

    if (data == undefined) return undefined
    if (data == null) return null

    const answers = data.filter((a) => a[0] == section && a[1] == question && a[4] != 'Y')  // Check for currently hidden

    if (answers.length > 0) {
        const answer = answers[0][2] == null ? answers[0][3] : answers[0][2]
        return answer == null ? null : Number.parseInt(answer)
    }
    return undefined
}


export function getSuperStatus(status: string) {

    switch (status) {
        case 'OPEN': return 'WIP'
        case 'COMPLETE': return 'COMPLETE'
        case 'SIGNED': return 'SIGNLOCK'
        case 'LOCKED_INCOMPLETE': return 'PARTCOMP'
        case 'AWAITING_PSR': return 'WIP/SIGNLOCK'
        case 'AWAITING_SBC': return 'WIP/SIGNLOCK'
        default: return status
    }
}

export function riskLabel(risk: string): string {

    switch (risk) {
        case 'L': return 'Low'
        case 'M': return 'Medium'
        case 'H': return 'High'
        case 'V': return 'Very High'
        case 'NA': return 'Not Applicable'
    }
    return risk
}

export function getSectionScore(dbAssessment: dbClasses.DbAssessment, sectionCode: string): number {

    const section = dbAssessment.sections.filter((s) => s.sectionCode == sectionCode)
    return section.length == 0 ? null : section[0].otherWeightedScore
}

function transformValue(lookup: string, lookupDictionary: { [keys: string]: string }): string {

    return lookupDictionary[lookup] == undefined ? lookup : lookupDictionary[lookup]
}

export function fixDp(value: number): number {

    if (value == undefined || value == null) return value
    return Number(value.toFixed(2))
}

export function getDateDiff(firstDate: string, secondDate: string, unit: 'year' | 'month' = 'year'): number {

    if (firstDate == null || secondDate == null) {
        return null
    }
    const d1 = dayjs(firstDate)
    const d2 = secondDate == '' ? dayjs() : dayjs(secondDate)

    return d2.diff(d1, unit)
}