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

export function lookupValue(value: string, lookup: {}): string {

    const result = lookup[value]
    return result == undefined ? value : result
}

export function lookupNumericValue(value: string, lookup: {}): number {

    const result = lookup[value]
    return result == undefined ? null : result
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