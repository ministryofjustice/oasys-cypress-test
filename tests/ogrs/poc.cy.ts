const tolerance = '1E-09'

describe('OGRS calculator test', () => {

    it('Proof of concept', () => {

        let failed = false

        cy.task('ogrsAssessmentCalcTest', { dataFile: 'ogrsTestData', tolerance: tolerance }).then((result: OgrsTestResult) => {

            report('orgsTestData', result)
            if (result.failed) {
                failed = true
            }   

        }).then(() => { expect(failed).equal(false) })

    })
})

function report(dataFile: string, result: OgrsTestResult) {

    cy.groupedLogStart(`Test data file: ${dataFile}, tolerance: ${tolerance}`)

    result.assessmentResults.forEach((assessment) => {

        assessment.logText.forEach((log) => {
            cy.groupedLog(log)
        })
    })
    cy.groupedLogEnd()
}