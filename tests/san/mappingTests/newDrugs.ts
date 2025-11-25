import * as oasys from 'oasys'
import { mappingTestOffenderFile } from './xMappingTest'

const drugs1 = new oasys.Pages.San.Drugs.Drugs1()
const drugs2 = new oasys.Pages.San.Drugs.Drugs2()
const drugs3 = new oasys.Pages.San.Drugs.Drugs3()

const expectedAnswers: OasysAnswer[] = [
    { section: '8', q: '8.1', a: `NO` },
    { section: '8', q: '8.2.8.1', a: null },
    { section: '8', q: '8.2.8.2', a: null },
    { section: '8', q: '8.2.8.3', a: null },
    { section: '8', q: '8.2.8.4', a: null },
    { section: '8', q: '8.2.7.1', a: null },
    { section: '8', q: '8.2.7.2', a: null },
    { section: '8', q: '8.2.7.3', a: null },
    { section: '8', q: '8.2.7.4', a: null },
    { section: '8', q: '8.2.11.1', a: null },
    { section: '8', q: '8.2.11.3', a: null },
    { section: '8', q: '8.2.5.1', a: null },
    { section: '8', q: '8.2.5.2', a: null },
    { section: '8', q: '8.2.5.3', a: null },
    { section: '8', q: '8.2.5.4', a: null },
    { section: '8', q: '8.2.4.1', a: null },
    { section: '8', q: '8.2.4.2', a: null },
    { section: '8', q: '8.2.4.3', a: null },
    { section: '8', q: '8.2.4.4', a: null },
    { section: '8', q: '8.2.10.1', a: null },
    { section: '8', q: '8.2.10.3', a: null },
    { section: '8', q: '8.2.9.1', a: null },
    { section: '8', q: '8.2.9.3', a: null },
    { section: '8', q: '8.2.1.1', a: null },
    { section: '8', q: '8.2.1.2', a: null },
    { section: '8', q: '8.2.1.3', a: null },
    { section: '8', q: '8.2.1.4', a: null },
    { section: '8', q: '8.2.2.1', a: null },
    { section: '8', q: '8.2.2.2', a: null },
    { section: '8', q: '8.2.2.3', a: null },
    { section: '8', q: '8.2.2.4', a: null },
    { section: '8', q: '8.2.6.1', a: null },
    { section: '8', q: '8.2.6.2', a: null },
    { section: '8', q: '8.2.6.3', a: null },
    { section: '8', q: '8.2.6.4', a: null },
    { section: '8', q: '8.2.3.1', a: null },
    { section: '8', q: '8.2.3.2', a: null },
    { section: '8', q: '8.2.3.3', a: null },
    { section: '8', q: '8.2.3.4', a: null },
    { section: '8', q: '8.2.12.1', a: null },
    { section: '8', q: '8.2.12.3', a: null },
    { section: '8', q: '8.2.13.1', a: null },
    { section: '8', q: '8.2.13.2', a: null },
    { section: '8', q: '8.2.13.3', a: null },
    { section: '8', q: '8.2.13.4', a: null },
    { section: '8', q: '8.2.15.1', a: null },
    { section: '8', q: '8.2.15.3', a: null },
    { section: '8', q: '8.2.14.1', a: null },
    { section: '8', q: '8.2.14.2', a: null },
    { section: '8', q: '8.2.14.3', a: null },
    { section: '8', q: '8.2.14.4', a: null },
    { section: '8', q: '8.2.14.t', a: null },
    { section: '8', q: '8.4', a: `0` },
    { section: '8', q: '8.5', a: `M` },
    { section: '8', q: '8.6', a: `0` },
    { section: '8', q: '8.8', a: null },
    { section: '8', q: '8.9', a: null },
    { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `NO` },
]

describe('Mapping test for drugs', () => {

    it('Amphetamines', () => {


        // // Occasional error in SAN 'Cannot read properties of null (reading 'postMessage')'.  Need to workaround it with the following:
        // Cypress.on('uncaught:exception', () => {
        //     cy.log('Cypress Exception')
        //     return false
        // })

        cy.wrap(false).as('failed')

        cy.readFile(mappingTestOffenderFile).then((offenderDetails) => {
            const mappingTestOffender = JSON.parse(offenderDetails) as OffenderDef

            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
            oasys.Assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
            oasys.logout()

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Db.getLatestSetPkByPnc(mappingTestOffender.pnc, 'assessmentPk')
            cy.get<number>('@assessmentPk').then((assessmentPk) => {

                oasys.San.gotoSan('Drug use', 'information')
                drugs1.everUsed.setValue('yes')
                drugs1.saveAndContinue.click()
                drugs2.drugType.setValue(['amphetamines'])
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Previous', true)
                oasys.Nav.clickButton('Next', true)

                oasys.Db.checkAnswers(assessmentPk, expectedAnswers, 'failed')

                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).to.be.false
                })
            })
        })
    })
})

