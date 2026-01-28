/**
 * __oasys.*function*__  
 * 
 * Generate test data: dates and long strings.
 * 
 * @module Autodata
 */

import { Temporal } from '@js-temporal/polyfill'

export let testStartDate = Temporal.Now.plainDateISO()

/**
 * Calculate a date based on the test start date (i.e. today unless the test runs over midnight), using an OasysDate object which can contain any of the following (all optional):
 *  - years
 *  - months
 *  - weeks
 *  - days
 * 
 * These should be provided as positive or negative integers which are used as offsets to calculate a date.
 * The return value is a string in the normal OASys date format (dd/mm/yyyy).
 * 
 * If no values are specified (or no parameter at all), returns today's date.  If the parameter is a string, it is returned unchanged.
 */
export function oasysDateAsString(offset?: OasysDate): string {

    if (typeof offset == 'string') {
        return offset
    }

    return calculateOffsetDate(offset).toLocaleString()
}

export function oasysDateAsPlainDate(offset?: OasysDate): Temporal.PlainDate {

    if (offset == null || typeof offset == 'string') {
        return null
    }
    return calculateOffsetDate(offset)
}

function calculateOffsetDate(offset: OasysDate): Temporal.PlainDate {

    const d = offset as { days?: number, weeks?: number, months?: number, years?: number }
    let result = testStartDate

    if (d.days) result = result.add({ days: d.days })
    if (d.months) result = result.add({ months: d.months })
    if (d.years) result = result.add({ years: d.years })

    return result
}
/** 
 * Returns a string with x characters.  The string includes some spaces and carriage returns, and a counter at regular intervals.
 */
export function oasysString(length: number): string {

    let result = ''
    let i = 0
    let letters = 'ABCD efg'
    let lineLength = 0

    while (i < length - 12) {
        // Add 10 characters at a time, including a counter, until nearly at the end
        i += 10
        lineLength += 10
        let counter = i.toString()
        result += `${letters.substring(0, 10 - counter.length)}${counter}`

        if (lineLength == 400) {
            result += '\n'  // newline counts 2 characters
            i += 2
            lineLength = 0
        }
    }

    return `${result}${'.'.repeat(length - i)}`
}