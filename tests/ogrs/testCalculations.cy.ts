import { OgrsTestScriptResult } from '../../cypress/support/ogrs/orgsTest'

const tolerance = '1E-09'

describe('OGRS calculator test', () => {

    it('Test calculations', () => {

        let failed = false

        cy.task('ogrsAssessmentCalcTest', { dataFile: 'ogrsTestData', resultsFile: 'expectedTestResults', tolerance: tolerance }).then((result: OgrsTestScriptResult) => {

            report('orgsTestData', result)
            if (result.failed) {
                failed = true
            }

        }).then(() => { expect(failed).equal(false) })

    })
})

function report(dataFile: string, result: OgrsTestScriptResult) {

    cy.groupedLogStart(`Test data file: ${dataFile}, tolerance: ${tolerance}`)

    result.assessmentResults.forEach((assessment) => {

        assessment.logText.forEach((log) => {
            cy.groupedLog(log)
        })
    })
    cy.groupedLogEnd()
}
