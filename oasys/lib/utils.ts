import { Temporal } from '@js-temporal/polyfill'

export const dateFormat = 'YYYY-MM-DD' // RFC 9557 format for Temporal

// Convert date string to Temporal Plain date.  Might be in RFC9557 format, but also need to allow for DD/MM/YYYY in OASys string fields
export function getDate(param: string): Temporal.PlainDate {

    if (param == null) {
        return null
    }
    const reformatted = param.search('/') > 0 ? `${param.substring(6)}-${param.substring(3, 5)}-${param.substring(0, 2)}` : param
    try {
        return Temporal.PlainDate.from(reformatted)
    } catch (e) {
        return null
    }
}

export function getString(param: string): string {
    return param == '' || param == 'null' || param == null ? null : param
}

export function getInteger(param: string): number {
    return param == '' || param == null || param.toLowerCase() == 'null' ? null : Number.parseInt(param)
}

export function checkIfAfter(appDate: Temporal.PlainDate, compareDate: Temporal.PlainDate) {  // return true if second date is later or equal to than the first

    return Temporal.PlainDate.compare(appDate, compareDate) >= 0
}

export function lookupString(value: string, lookup: { [keys: string]: string }, translation: { [keys: string]: string } = null): string {

    const result = lookup[value]
    if (result == null || result == undefined) {
        return null
    }

    return translation == null ? result : lookupString(result, translation)
}

export function lookupInteger(value: string, lookup: { [keys: string]: string | number }, translation: { [keys: string]: number } = null): number {

    const result = lookup[value]
    if (result == null || result == undefined) {
        return null
    }
    if (translation == null) {
        return typeof result == 'string' ? stringToInt(result) : result
    } else {
        return lookupInteger(result as string, translation)
    }
}

export function lookupFloat(value: string, lookup: { [keys: string]: string | number }): number {

    const result = lookup[value]
    if (result == null || result == undefined) {
        return null
    }
    return typeof result == 'string' ? stringToFloat(result) : result
}

export function stringToInt(param: string): number {

    const result = Number.parseInt(param)
    return Number.isInteger(result) ? result : null
}

export function stringToFloat(param: string): number {

    const result = Number.parseFloat(param)
    return Number.isNaN(result) ? null : result
}

export function dateParameterToString(param: Temporal.PlainDate): string {

    return param == null ? 'null' : `to_date('${param?.toLocaleString().replace('/', '-')}','DD-MM-YYYY')`
}

export function stringParameterToString(param: string): string {

    return param == null ? 'null' : `'${param}'`
}

export function numericParameterToString(param: number): string {

    return param == null ? 'null' : param.toString()
}

export function dateParameterToCsvOutputString(param: Temporal.PlainDate): string {

    return param == null ? 'null' : `${param.toLocaleString()}`
}

export function stringParameterToCsvOutputString(param: string): string {

    return param == null ? '' : param
}

export function numericParameterToCsvOutputString(param: number): string {

    return param == null ? '' : param.toString()
}

export function problemsAnswerToNumeric(param: ProblemsAnswer | ProblemsMissingAnswer): number {

    switch (param) {
        case '0-No problems':
            return 0
        case '1-Some problems':
            return 1
        case '2-Significant problems':
            return 2
    }
    return null  // includes 'Missing'
}