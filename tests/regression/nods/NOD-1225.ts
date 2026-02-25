import * as oasys from 'oasys'

describe('NOD-1225', () => {

    // First offender has low risks in the SARA
    // Second offender has high risks in the SARA
    // Create a second assessment on offender 1, create the SARA but reject it at S&L

    it('NOD-1225', () => {
        oasys.login(oasys.Users.probHeadPdu)

        // Offender 1
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender1) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()
            oasys.Populate.sections2To13NoIssues({ populate6_11: 'No' })
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
            oasys.Populate.Rosh.screeningNoRisks()
            const section6 = new oasys.Pages.Assessment.Section6().goto()
            section6.o6_7.setValue('Yes')
            section6.o6_7PerpetratorFamily.setValue('No')
            section6.o6_7PerpetratorPartner.setValue('Yes')
            section6.o6_7VictimFamily.setValue('No')
            section6.o6_7VictimPartner.setValue('No')

            const r24 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
            r24.r2_3.setValue('No')
            r24.rationale.setValue('because')

            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Create')

            oasys.Populate.Sara.sara('Low', 'Low')
            oasys.Nav.clickButton('Save')
            oasys.Nav.clickButton('Sign & lock')
            oasys.Nav.clickButton('Confirm Sign & Lock')

            oasys.Nav.history(offender1.surname, offender1.forename1, 'Start of Community Order')
            oasys.Populate.SentencePlanPages.IspSection52to8.minimal()
            oasys.Assessment.signAndLock({ expectRsrWarning: true })

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            // Second assessment on offender 1
            oasys.Nav.history(offender1)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            new oasys.Pages.Rosh.RoshScreeningSection5().goto()
            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Create')

            // High risk on SARA
            const sara = new oasys.Pages.Sara.Sara().goto()
            sara.riskOfViolencePartner.setValue('High')
            sara.riskOfViolenceOthers.setValue('High')
            oasys.Nav.clickButton('Save')
            oasys.Nav.clickButton('Close')

            // Complete the assessment and reject the SARA
            oasys.Nav.history(offender1, 'Review')
            new oasys.Pages.SentencePlan.RspSection72to10().goto().signAndLock.click()
            oasys.Nav.clickButton('Continue with Signing')
            new oasys.Pages.Signing.SigningStatus().noSaraReason.setValue('There was no suitably trained assessor available')
            oasys.Nav.clickButton('Continue with Signing')
            oasys.Nav.clickButton('Confirm Sign & Lock')

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            // Third assessment on offender 1
            oasys.Nav.history(offender1)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
            new oasys.Pages.Rosh.RoshScreeningSection5().goto()
            oasys.Nav.clickButton('Next')
            oasys.Nav.clickButton('Create')

            // Clear risk on SARA
            sara.goto()
            sara.riskOfViolencePartner.setValue('')
            sara.riskOfViolenceOthers.setValue('')
            oasys.Nav.clickButton('Save')
            oasys.Nav.clickButton('Close')

            // Complete the assessment and reject the SARA
            oasys.Nav.history(offender1, 'Review')
            new oasys.Pages.SentencePlan.RspSection72to10().goto().signAndLock.click()
            oasys.Nav.clickButton('Continue with Signing')
            new oasys.Pages.Signing.SigningStatus().noSaraReason.setValue('There was no suitably trained assessor available')
            oasys.Nav.clickButton('Continue with Signing')
            oasys.Nav.clickButton('Confirm Sign & Lock')

            oasys.Api.testOneOffender(offender1.probationCrn, 'prob', 'probationFailedAlias', false, true)
            cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                expect(offenderFailed).to.be.false
            })

            oasys.logout()
        })
    })

})