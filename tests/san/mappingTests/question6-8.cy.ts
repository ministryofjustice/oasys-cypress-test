import * as oasys from 'oasys'
import { mappingTestOffenderFile } from './xMappingTest'

const accommodation1 = new oasys.Pages.San.Accommodation.Accommodation1()
const accommodation2 = new oasys.Pages.San.Accommodation.Accommodation2()
const relationshipsLanding = new oasys.Pages.San.SectionLandingPage('Personal relationships and community')
const relationships1 = new oasys.Pages.San.Relationships.Relationships1()
const relationships2 = new oasys.Pages.San.Relationships.Relationships2()

type AccommodationOptions = 'family' | 'friends' | 'partner' | 'child' | 'other' | 'unknown' | 'alone'
type RelationshipOptions = 'partner' | 'ownChildren' | 'otherChildren' | 'family' | 'friends' | 'other'

describe('Mapping test for question 6.8', () => {

    it('Mapping test for question 6.8', () => {

        /*
        Who is [subject] living with?
            If living_with contains 'PARTNER' then
                6-8 = 1
            else if 'Who are the important people in [subject]'s life?' = 'PARTNER_INTIMATE_RELATIONSHIP' Then
                6-8 = 2
            else
                6-8 = 3
            End If
        */

        // Occasional error in SAN 'Cannot read properties of null (reading 'postMessage')'.  Need to workaround it with the following:
        Cypress.on('uncaught:exception', () => {
            cy.log('Cypress Exception')
            return false
        })

        const logText: string[] = []
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

                const testCases: { accommodation: AccommodationOptions[], relationship: RelationshipOptions[], mapping: number }[] =
                    [
                        { accommodation: [], relationship: [], mapping: null },
                        { accommodation: ['alone'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['child'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['family'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['friends'], relationship: ['other'], mapping: 3 }, // 5
                        { accommodation: ['other'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['unknown'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['child', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['family', 'partner'], relationship: ['other'], mapping: 1 }, // 10
                        { accommodation: ['friends', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['other', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['unknown', 'partner'], relationship: ['other'], mapping: 1 },
                        { accommodation: ['alone'], relationship: ['family'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['friends'], mapping: 3 }, // 15
                        { accommodation: ['alone'], relationship: ['other'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['otherChildren'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['ownChildren'], mapping: 3 },
                        { accommodation: ['alone'], relationship: ['partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['family', 'partner'], mapping: 2 },  // 20
                        { accommodation: ['alone'], relationship: ['friends', 'partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['other', 'partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['otherChildren', 'partner'], mapping: 2 },
                        { accommodation: ['alone'], relationship: ['ownChildren', 'partner'], mapping: 2 },
                        { accommodation: ['child', 'partner'], relationship: ['family', 'partner'], mapping: 1 }, // 25
                        { accommodation: ['family', 'partner'], relationship: ['friends', 'partner'], mapping: 1 },
                        { accommodation: ['other', 'partner'], relationship: ['other', 'partner'], mapping: 1 },
                        { accommodation: ['alone'], relationship: ['otherChildren', 'partner'], mapping: 2 },
                        { accommodation: ['unknown', 'partner'], relationship: ['ownChildren', 'partner'], mapping: 1 },
                    ]

                let first = true
                let i = 1
                for (const test of testCases) {
                    oasys.San.gotoSan('Accommodation', 'information', true)
                    setAccommodationOptions(test.accommodation, first)
                    setRelationshipOptions(test.relationship, first)
                    logText.push(`${i}: ${JSON.stringify(test)}`)
                    checkMapping(assessmentPk, test.mapping, logText, i)
                    first = false
                    i++
                }


                cy.get<boolean>('@failed').then((failed) => {
                    cy.groupedLogStart('Test case details:')
                    logText.forEach((line) => { cy.groupedLog(line) })
                    cy.groupedLogEnd().then(() => {
                        oasys.logout()
                        expect(failed).to.be.false
                    })
                })
            })
        })
    })
})

function setAccommodationOptions(options: AccommodationOptions[], firstRun: boolean) {

    if (firstRun) {
        accommodation1.currentAccommodation.setValue('settled')
        accommodation1.settledAccommodationType.setValue('homeowner')
    }
    accommodation1.saveAndContinue.click()
    accommodation2.livingWith.setValue(options)
}

function setRelationshipOptions(options: RelationshipOptions[], firstRun: boolean) {

    relationshipsLanding.goto(true)
    relationshipsLanding.information.click()
    if (firstRun) {
        relationships1.anyChildren.setValue(['no'])
        relationships1.saveAndContinue.click()
    }
    relationships2.importantPeople.setValue(options)
}

function checkMapping(assessmentPk: number, expectedValue: number, logText: string[], testCase: number) {

    oasys.San.returnToOASys()
    oasys.Nav.clickButton('Previous', true)
    oasys.Nav.clickButton('Next', true)

    oasys.Db.checkSingleAnswer(assessmentPk, '6', '6.8', 'refAnswer', expectedValue == null ? null : expectedValue.toString(), 'failed', logText, testCase)
}