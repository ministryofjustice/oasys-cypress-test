import * as dayjs from 'dayjs'

import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters } from '../../cypress/support/ogrs/types'

describe('OGRS calculator test', () => {

    const tolerance = '1E-37'
    const precision = 40
    const count = 100
    const reportMode: 'verbose' | 'normal' | 'minimal' = 'minimal'

    let cases = 0
    let failures = 0
    let summary: { title: string, cases: number, failures: number, duration: number }[] = []

    let start = dayjs()

    it(`Layer 3 v1 complete`, () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'db',
            dbDetails: {
                type: 'assessment',
                whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`,
                count: count,
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })

    })

    it(`Layer 3 v1 not complete (any other status)`, () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'db',
            dbDetails: {
                type: 'assessment',
                whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`,
                count: count,
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })

    })

    it(`Layer 3 v2 complete`, () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'db',
            dbDetails: {
                type: 'assessment',
                whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
                count: count,
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })

    })

    it(`Layer 1 v2 complete`, () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'db',
            dbDetails: {
                type: 'assessment',
                whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
                count: count,
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })

    })

    it(`Standalone RSR complete`, () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'db',
            dbDetails: {
                type: 'rsr',
                whereClause: `deleted_date is null and rsr_status = 'COMPLETE'`,
                count: count,
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })

    })

    it('Example set of 20', () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'test1Input',
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })


    })
    it('Example set of 20 (with some missing questions)', () => {

        const ogrsTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'test1inputWithMissingFields',
            },
            tolerance: tolerance,
            precision: precision,
            reportMode: reportMode,
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            checkAndLogOutcome()
        })
    })

    function checkAndLogOutcome() {

        const now = dayjs()
        summary.push({ title: Cypress.currentTest.title, cases: cases, failures: failures, duration: now.diff(start) })
        start = now  // set for the next test

        if (failures > 0) {
            throw new Error(`${failures} failed out of ${cases}`)
        }
    }

    it('Summary', () => {
        
        const totalCases = summary.reduce((n, { cases }) => n + cases, 0)
        const totalFailures = summary.reduce((n, { failures }) => n + failures, 0)
        const totalDuration = summary.reduce((n, { duration }) => n + duration, 0)
        cy.groupedLogStart(`TOTAL ${totalCases} tests, ${totalFailures} failures.  Duration: ${(totalDuration/1000).toFixed(0)}s`)
        cy.groupedLog('')

        summary.forEach((test) => cy.groupedLog(`${test.title}: ${test.cases} tests, ${test.failures} failure(s).  Duration: ${test.duration}ms`))
        cy.groupedLogEnd()
    })
})

function report(testParams: OgrsTestParameters, result: OgrsTestScriptResult) {

    if (testParams.testType == 'csv') {
        cy.groupedLogStart(`Test data file: ${testParams.csvDetails.dataFile}, expected results file: ${testParams.csvDetails.expectedResultsFile}, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)
    } else {
        cy.groupedLogStart(`Test data from OASys, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)
    }
    cy.groupedLog(`Cases: ${result.cases}, failures: ${result.failures}.  ${result.failures > 0 ? 'FAILED' : 'PASSED'}`)

    let outputData = ''

    result.testCaseResults.forEach((testCase) => {

        testCase.logText.forEach((log) => {
            cy.groupedLog(log)
        })
        if (testParams.outputFile) {
            outputData = `${outputData}${createOutputCsvLine(testCase.outputParams)}\n`
        }
    })
    cy.groupedLogEnd()

    if (testParams.outputFile) {
        cy.writeFile(`./cypress/downloads/${testParams.outputFile}.csv`, outputData.slice(0, -1), { encoding: null })
    }
}

function createOutputCsvLine(outputParams: OutputParameters): string {

    let line = ''
    Object.keys(outputParams).forEach((key) => {
        const value = outputParams[key]
        line = `${line}${value ?? ''},`
    })
    return line.slice(0, -1) // remove last comma
}