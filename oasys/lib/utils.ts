import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

export const dateFormat = 'DD-MM-YYYY'

export function getDate(param: string): dayjs.Dayjs {

    dayjs.extend(customParseFormat)
    dayjs.extend(utc)
    const result = dayjs.utc(param, dateFormat)
    return !result.isValid() ? null : result
}

export function getString(param: string): string {
    return param == '' || param == 'null' || param == null ? null : param
}

export function getInteger(param: string): number {
    return param == '' || param == null || param.toLowerCase() == 'null' ? null : Number.parseInt(param)
}

export function checkIfAfter(appDate: Dayjs, compareDate: Dayjs) {  // return true if second date is later or equal to than the first

    return !compareDate.isBefore(appDate)
} export function lookupValue(value: string, lookup: {}): string {

    const result = lookup[value]
    return result == undefined ? value : result
}

