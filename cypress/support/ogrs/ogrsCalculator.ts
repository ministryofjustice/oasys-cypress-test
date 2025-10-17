import { Decimal } from 'decimal.js'

import { TestCaseParameters, TestCaseResult, OutputParameters, OgrsTestParameters } from './types'
import { calculate } from './calculateScore'
import { ospRsrCalc } from './ospRsr'
import { createOutputObject } from './createOutput'


export function calculateTestCase(testCaseParams: TestCaseParameters, expectedResults: OutputParameters, testCaseRef: string, testParams: OgrsTestParameters): TestCaseResult {

    Decimal.set({ precision: testParams.precision })
    const testCaseResult: TestCaseResult = {
        logText: [],
        failed: false,
        inputParams: testCaseParams,
        outputParams: createOutputObject(),
        identifier: testCaseRef,
    }

    // Calculate individual scores
    // Extended versions for SNSV, OGP and OVP if possible
    calculate('serious_violence_extended', testCaseParams, testCaseResult.outputParams)
    calculate('general_extended', testCaseParams, testCaseResult.outputParams)
    calculate('violence_extended', testCaseParams, testCaseResult.outputParams)

    // Attempt brief versions for SNSV, OGRS4G, OGRS4V if no results from the extended ones.
    calculate('serious_violence_brief', testCaseParams, testCaseResult.outputParams, testCaseResult.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y')
    calculate('general_brief', testCaseParams, testCaseResult.outputParams, testCaseResult.outputParams.OGP2_CALCULATED == 'Y')
    calculate('violence_brief', testCaseParams, testCaseResult.outputParams, testCaseResult.outputParams.OVP2_CALCULATED == 'Y')

    // OSP and RSR
    ospRsrCalc(testCaseParams, testCaseResult.outputParams)

    // Compare and report results
    const logText: string[] = []
    testCaseResult.failed = checkResults(expectedResults, testCaseResult.outputParams, testParams, logText)

    if (testCaseResult.failed || testParams.reportMode != 'minimal') {
        testCaseResult.logText.push('')
        testCaseResult.logText.push(`Test case ${testCaseRef} ${testCaseResult.failed ? ' *** FAILED ***' : ' PASSED'}`)
        testCaseResult.logText.push(`    Input parameters: ${JSON.stringify(testCaseParams)}`)
        testCaseResult.logText.push(`    Oracle result:    ${JSON.stringify(expectedResults)}`)
        testCaseResult.logText.push(`    Cypress result:   ${JSON.stringify(testCaseResult.outputParams)}`)
        if (testCaseResult.failed || testParams.reportMode == 'verbose') {
            testCaseResult.logText.push('')
            testCaseResult.logText.push(...logText)
        }
    }
    return testCaseResult
}

function checkResults(expectedResults: OutputParameters, actualResults: OutputParameters, testParams: OgrsTestParameters, logText: string[]): boolean {

    // Compare the complete result set for a single test case, line by line, to determine failure and generate report

    const tolerance = new Decimal(testParams.tolerance)
    let failed = false

    Object.keys(expectedResults).forEach((param) => {

        // tolerance check for _SCORE and _COPAS, decimal check for all other numbers except _COUNT, array check for _MISSING_QUESTIONS, simple equality for everything else
        let mode: 'decimal' | 'tolerance' | 'simple' | 'missing' = 'simple'

        if (!Number.isNaN(Number.parseFloat(expectedResults[param])) && !Number.isNaN(Number.parseFloat(actualResults[param]))) {  // numeric comparison required

            if ((param.includes('_SCORE') && param != 'OSP_DC_SCORE') || param.includes('_COPAS')) {
                mode = 'tolerance'
            } else if (!param.includes('_COUNT')) {
                mode = 'decimal'
            }
        } else if (param.includes('MISSING_QUESTIONS')) {
            mode = 'missing'
        }

        // check Decimal values - with tolerance for scores
        if (mode == 'decimal' || mode == 'tolerance') {
            const diff = expectedResults[param].minus(actualResults[param]).abs()
            if ((mode == 'tolerance' && diff.greaterThan(tolerance)) || (mode == 'decimal' && diff.greaterThan(0))) {
                failed = true
                if (mode == 'tolerance' || (mode == 'decimal' && diff.greaterThan(0))) {
                    logText.push(`      ${param} *** failed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}, difference: ${diff}`)
                }
            } else if (mode == 'tolerance' && testParams.reportMode != 'minimal') {
                logText.push(`      ${param} passed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}, difference: ${diff}`)
            } else if (testParams.reportMode == 'verbose') {
                logText.push(`      ${param} passed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}`)
            }

            // missing questions list
        } else if (mode == 'missing') {
            const expectedMissing = JSON.stringify(expectedResults[param])
            const actualMissing = JSON.stringify(actualResults[param])
            if (expectedMissing != actualMissing) {
                logText.push(`      ${param} *** failed: Oracle ${expectedMissing}, Cypress ${actualMissing}`)
                failed = true
            }
            else if (testParams.reportMode == 'verbose') {
                logText.push(`      ${param} passed: Oracle ${expectedMissing}`)
            }

            // simple equality check
        } else if (actualResults[param] != expectedResults[param]) {
            failed = true
            logText.push(`      ${param} *** failed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}`)

            // otherwise passed
        } else if (testParams.reportMode == 'verbose') {
            logText.push(`      ${param} passed: ${expectedResults[param]}`)
        }
    })

    return failed
}
