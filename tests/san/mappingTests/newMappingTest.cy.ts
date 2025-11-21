import * as oasys from 'oasys'
import { mappingTestOffenderFile } from './xMappingTest'

describe('Mapping test for question 6.8', () => {

    it('Mapping test for question 6.8', () => {

        // Occasional error in SAN 'Cannot read properties of null (reading 'postMessage')'.  Need to workaround it with the following:
        Cypress.on('uncaught:exception', () => {
            cy.log('Cypress Exception')
            return false
        })

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
                cy.log(`Assessment PK: ${assessmentPk}`)

                // Set up the accommodation and relationship sections sufficient to get to the key questions
                oasys.San.gotoSan('Accommodation', 'information')
                const accommodation1 = new oasys.Pages.San.Accommodation.Accommodation1()
                accommodation1.currentAccommodation.setValue('settled')
                accommodation1.settledAccommodationType.setValue('homeowner')
                cy.screenshot()
                accommodation1.saveAndContinue.click()

                const accommodation2 = new oasys.Pages.San.Accommodation.Accommodation2()
                accommodation2.livingWith.setValue(['family'])
                cy.screenshot()



                
                oasys.San.returnToOASys()

                oasys.logout()
            })
        })
    })
})