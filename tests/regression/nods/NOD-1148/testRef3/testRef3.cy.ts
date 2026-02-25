import { Ogrs4CalcResult } from 'lib/ogrs'
import * as oasys from 'oasys'

describe('OGRS regression test ref 3', () => {

    it('Test ref 3 part 1', () => {

        oasys.login(oasys.Users.probHeadPdu)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)
            // const offender: OffenderDef = {
            //     forename1: 'Autotest',
            //     gender: 'Male',
            //     dateOfBirth: { years: -25 },
            //     probationCrn: 'ZXCUTIV',
            //     pnc: '41/7061614Q',
            // }

            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
            oasys.Populate.fullyPopulated({ layer: 'Layer 1V2' })
            // oasys.Nav.history()            

            const predictors = new oasys.Pages.Assessment.RoshaPredictors().goto()
            // predictors.o1_39.setValue('Yes')
            // predictors.save.click()


            const ogrsCalc = oasys.Ogrs.checkOgrs4CalcsOffender(offender, 'ogrs')
            cy.get<Ogrs4CalcResult>('@ogrs').then((ogrs) => {
                predictors.arpText.checkValue(ogrs.arpText)
                predictors.vrpText.checkValue(ogrs.vrpText)
                predictors.svrpText.checkValue(ogrs.svrpText)
                predictors.dcSrpBand.checkValue(ogrs.dcSrpBand)
                predictors.iicSrpBand.checkValue(ogrs.iicSrpBand)
                predictors.csrpBand.checkValue(ogrs.csrpBand)
                predictors.csrpType.checkValue(ogrs.csrpType)
                predictors.csrpScore.checkValue(ogrs.csrpScore)

                oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })

                oasys.logout()
            })
        })
    })

})
