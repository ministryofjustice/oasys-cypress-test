import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters } from '../../cypress/support/ogrs/types'

describe('OGRS calculator test', () => {

    const tolerance = '1E-35'
    const precision = 40

    it('Test calculations set 1', () => {

        let failed = false

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: 'test1input',
            expectedResultsFile: '',
            outputFile: '',
            headers: false,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            if (result.failed) {
                failed = true
            }

        }).then(() => { expect(failed).equal(false) })

    })

        it('Test calculations set 2 (with some missing questions)', () => {

        let failed = false

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: 'test1inputWithMissingFields',
            expectedResultsFile: '',
            outputFile: '',
            headers: false,
            dateFormat: 'DD-MM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'minimal',
        }

        cy.task('ogrsAssessmentCalcTest', ogrsTestParams).then((result: OgrsTestScriptResult) => {

            report(ogrsTestParams, result)
            if (result.failed) {
                failed = true
            }

        }).then(() => { expect(failed).equal(false) })

    })
})

function report(testParams: OgrsTestParameters, result: OgrsTestScriptResult) {

    cy.groupedLogStart(`Test data file: ${testParams.dataFile}, expected results file: ${testParams.expectedResultsFile}, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)

    let outputData = ''
    if (testParams.dataFile != '' && testParams.headers) {
        outputData = `${createHeaderLine(result.testCaseResults[0].outputParams)}\n`
    }

    result.testCaseResults.forEach((testCase) => {

        testCase.logText.forEach((log) => {
            cy.groupedLog(log)
        })
        if (testParams.outputFile != '') {
            outputData = `${outputData}${createOutputCsvLine(testCase.outputParams)}\n`
        }
    })
    cy.groupedLogEnd()

    if (testParams.outputFile != '') {
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