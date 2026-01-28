import * as oasys from 'oasys'

import { Temporal } from '@js-temporal/polyfill'
describe('OGRS regression test ref 3', () => {

    it('Test ref 3 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probHeadPdu)
            // oasys.Offender.searchAndSelectByPnc(offender.pnc)
            // oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
            // oasys.Populate.fullyPopulated({ layer: 'Layer 1V2' })
            oasys.Nav.history()

            const predictors = new oasys.Pages.Assessment.RoshaPredictors().goto()
            predictors.save.click()
            const ogrsInput: Ogrs4Params = {
                assessmentDate: {},
                staticCalc: 'N',
                dob: { years: -25 },
                gender: 'Male',
                offenceCode: '02801',
                totalSanctionsCount: 5,
                totalViolentSanctions: 1,
                contactAdultSanctions: 0,
                contactChildSanctions: 0,
                indecentImageSanctions: 0,
                paraphiliaSanctions: 2,
                strangerVictim: 'Y',
                ageAtFirstSanction: 23,
                lastSanctionDate: { days: -7 },
                dateRecentSexualOffence: { years: -5 },
                currSexOffMotivation: 'Y',
                mostRecentOffence: null,
                communityDate: { months: 18 },
                onePointThirty: 'Y',
                twoPointTwo: 'Y',
                threePointFour: 1,
                fourPointTwo: 'Y',
                sixPointFour: 2,
                sixPointSeven: 0,
                sixPointEight: 'In a relationship, living together',
                sevenPointTwo: 1,
                dailyDrugUser: 'N',
                eightPointEight: 0,
                ninePointOne: 1,
                ninePointTwo: 0,
                elevenPointTwo: 0,
                elevenPointFour: 1,
                twelvePointOne: 1,
                aggravatedBurglary: 1,
                arson: 1,
                criminalDamageLife: 1,
                firearms: 1,
                gbh: 1,
                homicide: 1,
                kidnap: 1,
                robbery: 1,
                weaponsNotFirearms: 1,
                custodyInd: 'N',

            }

            const ogrsCalc = oasys.Ogrs.calculateOgrs4(ogrsInput, 'ogrs')
            cy.get<Ogrs4CalcResult>('@ogrs').then((ogrs) => {
                cy.log(JSON.stringify(ogrs))
                predictors.arp.checkValue(ogrs.arpResult)

                // oasys.Assessment.signAndLock({ expectRsrScore: true })

                oasys.logout()
            })
        })
    })

})
