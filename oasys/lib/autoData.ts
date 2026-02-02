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