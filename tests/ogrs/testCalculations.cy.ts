import { OgrsTestParameters, OgrsTestScriptResult } from '../../cypress/support/ogrs/types'

describe('OGRS calculator test', () => {

    const tolerance = '1E-09'
    const precision = 40

    it('Test calculations', () => {

        let failed = false

        const ogrsTestParams: OgrsTestParameters = {
            dataFile: 'ogrsTestData',
            resultsFile: 'expectedTestResults',
            headers: true,
            dateFormat: 'DD-MMM-YYYY',
            tolerance: tolerance,
            precision: precision,
            reportMode: 'verbose',
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

    cy.groupedLogStart(`Test data file: ${testParams.dataFile}, expected results file: ${testParams.resultsFile}, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)

    result.testCaseResults.forEach((assessment) => {

        assessment.logText.forEach((log) => {
            cy.groupedLog(log)
        })
    })
    cy.groupedLogEnd()
}
