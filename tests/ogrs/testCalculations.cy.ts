import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters } from '../../cypress/support/ogrs/types'

describe('OGRS calculator test', () => {

    const tolerance = '1E-37'
    const precision = 40
    const count = 5

    it(`Layer 3 v1 complete - ${count} assessments`, () => {

        let failures = 0

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: null,
            expectedResultsFile: null,
            outputFile: null,
            headers: false,
            assessmentCount: count,
            whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            failures = result.failures

        }).then(() => { expect(failures).equal(0) })

    })

    it(`Layer 3 v1 not complete (any other status) - ${count} assessments`, () => {

        let failures = 0

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: null,
            expectedResultsFile: null,
            outputFile: null,
            headers: false,
            assessmentCount: count,
            whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            failures = result.failures

        }).then(() => { expect(failures).equal(0) })

    })

    it(`Layer 3 v2 complete - ${count} assessments`, () => {

        let failures = 0

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: null,
            expectedResultsFile: null,
            outputFile: null,
            headers: false,
            assessmentCount: count,
            whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            failures = result.failures

        }).then(() => { expect(failures).equal(0) })

    })

    it(`Layer 1 v2 complete - ${count} assessments`, () => {

        let failures = 0

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: null,
            expectedResultsFile: null,
            outputFile: null,
            headers: false,
            assessmentCount: count,
            whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            failures = result.failures

        }).then(() => { expect(failures).equal(0) })

    })

    it('Example set of 20', () => {

        let failures = 0

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: 'test1Input',
            expectedResultsFile: null,
            outputFile: null,
            headers: false,
            assessmentCount: null,
            whereClause: null,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            failures = result.failures

        }).then(() => { expect(failures).equal(0) })


    })
    it('Example set of 20 (with some missing questions)', () => {

        let failures = 0

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: 'test1inputWithMissingFields',
            expectedResultsFile: null,
            outputFile: null,
            headers: false,
            assessmentCount: null,
            whereClause: null,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            failures = result.failures

        }).then(() => { expect(failures).equal(0) })


    })
})

function report(testParams: OgrsTestParameters, result: OgrsTestScriptResult) {

    if (testParams.dataFile != null) {
        cy.groupedLogStart(`Test data file: ${testParams.dataFile}, expected results file: ${testParams.expectedResultsFile}, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)
    } else {
        cy.groupedLogStart(`Test data from OASys, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)
    }
    cy.groupedLog(`Cases: ${result.cases}, failures: ${result.failures}.  ${result.failures > 0 ? 'FAILED' : 'PASSED'}`)

    let outputData = ''
    if (testParams.dataFile != '' && testParams.headers) {
        outputData = `${createHeaderLine(result.testCaseResults[0].outputParams)}\n`
    }

    result.testCaseResults.forEach((testCase) => {

        testCase.logText.forEach((log) => {
            cy.groupedLog(log)
        })
        if (testParams.outputFile != null) {
            outputData = `${outputData}${createOutputCsvLine(testCase.outputParams)}\n`
        }
    })
    cy.groupedLogEnd()

    if (testParams.outputFile != null) {
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

function createHeaderLine(outputParams: OutputParameters): string {

    let line = ''
    Object.keys(outputParams).forEach((key) => {
        line = `${line}${key},`
    })
    return line.slice(0, -1)
}