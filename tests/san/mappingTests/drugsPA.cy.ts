import * as oasys from 'oasys'
import { mappingTestOffenderFile } from './xMappingTest'

type TestCase = { ref: number, strengths: boolean, riskOfHarm: boolean, riskOfReoffending: boolean, textType: 'normal' | 'max' | 'empty' }

const practitionerAnalysis = new oasys.Pages.San.PractitionerAnalysis('Drug use')

describe('Mapping test for drugs - individual drugs details', () => {

    it('amphetamines', () => { paTest() })
})

function paTest() {

    cy.readFile(mappingTestOffenderFile).then((offenderDetails) => {
        // Get offender details (run aaSanMappingTestOffender if required to create the offender)
        const mappingTestOffender = JSON.parse(offenderDetails) as OffenderDef

        // Delete previous assessments so no data gets cloned
        oasys.login(oasys.Users.admin, oasys.Users.probationSan)
        oasys.Offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        oasys.Assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
        oasys.logout()

        // Create a new SAN assessment
        oasys.login(oasys.Users.probSanUnappr)
        oasys.Offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        oasys.Db.getLatestSetPkByPnc(mappingTestOffender.pnc, 'assessmentPk')
        cy.get<number>('@assessmentPk').then((assessmentPk) => {

            // Run all the scenarios for a single drug
            cy.wrap(false).as('failed')
            const testCases: TestCase[] =
                [
                    { ref: 1, strengths: true, riskOfHarm: false, riskOfReoffending: false, textType: 'normal' },

                ]

            let firstRun = true

            for (const test of testCases) {
                // Get to the right starting screen
                oasys.San.gotoSan('Drug use', 'analysis', true)

                // Set values on SAN, return to OASys and check the results
                scenario(test)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Previous', true)
                oasys.Nav.clickButton('Next', true)

                const failedAlias = `ref${test.ref}Alias`
                cy.groupedLogStart(JSON.stringify(test)).then(() => {  // Force Cypress to wait before running the next bit
                    checkAnswers(assessmentPk, test, failedAlias)
                    cy.get<boolean>(`@${failedAlias}`).then((scenarioFailed) => {
                        if (scenarioFailed) {
                            cy.wrap(true).as('failed')
                        } else {
                            cy.groupedLog('Passed')
                        }
                        cy.task('consoleLog', `Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)
                    }).then(() => {
                        cy.groupedLogEnd()
                    })
                })
                firstRun = false
            }

            cy.get<boolean>('@failed').then((failed) => {
                expect(failed).to.be.false
            })
        })
    })
}

function scenario(test: TestCase) {

    setValues('strengths', test)
    setValues('riskOfHarm', test)
    setValues('riskOfReoffending', test)
}

function setValues(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', test: TestCase) {

    if (test[question]) {
        practitionerAnalysis[question].setValue('yes')
        practitionerAnalysis[`${question}YesDetails`].setValue(getText(question, true, test.textType))
    } else {
        practitionerAnalysis[question].setValue('no')
        practitionerAnalysis[`${question}NoDetails`].setValue(getText(question, false, test.textType))
    }
}

function getText(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', yes: boolean, textType: 'normal' | 'max' | 'empty'): string {

    switch (textType) {
        case 'normal':
            return `${question} text - ${yes ? 'yes' : 'no'} selected`
        case 'max':
            oasys.oasysString(question == 'riskOfReoffending' ? 1000 : 1425)
        case 'empty':
            return ''
    }
}

function checkAnswers(assessmentPk: number, test: TestCase, resultAlias: string) {

    /*

    */

    // Template response data for these tests
    const expectedAnswers: OasysAnswer[] = [
        { section: '8', q: '8.8', a: 'YES' },
        { section: '8', q: '8.9', a: null },
        { section: '8', q: '8.97', a: null },
        { section: '8', q: '8.98', a: null },
        { section: '8', q: '8.99', a: null },
        { section: '8', q: '8_SAN_STRENGTH', a: null },
    ]

    const expectedAnswersTemplateSAN: OasysAnswer[] = [
        { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: 'NO' },
    ]
    cy.task('checkSectionAnswers', { assessmentPk: assessmentPk, section: '8', expectedAnswers: expectedAnswers }).then((result: CheckDbSectionResponse) => {

        result.report.forEach((line) => {
            if (line.includes('FAILED')) {
                cy.groupedLog(line)
            }
        })
        cy.wrap(result.failed).as(resultAlias)
    })
}
