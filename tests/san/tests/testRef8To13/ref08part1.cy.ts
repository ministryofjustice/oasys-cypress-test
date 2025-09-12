import * as oasys from 'oasys'

describe('SAN integration - test ref 08 part 1', () => {

    it('Test ref 8 part 1 - Create and complete layer 3 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            cy.log(`Create a new assessment - defaults to PSR-SDR, Layer 3, PSR Outline Plan with SDR court report
                    Ensure the new SAN question is not showing on the screen (cannot do SAN with a PSR type assessment)`)

            oasys.Assessment.getToCreateAssessmentPage()
            let createAssessmentPage = new oasys.Pages.Assessment.CreateAssessment()
            createAssessmentPage.purposeOfAssessment.checkValue('PSR - SDR')
            createAssessmentPage.assessmentLayer.checkValue('Full (Layer 3)')
            createAssessmentPage.includeSanSections.checkStatus('notVisible')

            cy.log(`Change the POA to 'Start of Community Order' with an ISP
                    Ensure the new SAN question 'Include strengths and needs sections' is shown with a default setting of 'Yes'
                    Drop downs on this new question are null, No and Yes
                    Set the anwer to null, and click on the <Create> button
                    Error shown at the top of the screen that it is mandatory to complete the question
                    Change the answer from null to 'No'
                    Click on <Create>`)
            createAssessmentPage.purposeOfAssessment.setValue('Start of Community Order')
            createAssessmentPage.sentencePlanType.setValue('Initial')

            createAssessmentPage.includeSanSections.checkStatusAndValue('enabled', 'Yes')
            createAssessmentPage.includeSanSections.checkOptions(['', 'Yes', 'No'])
            createAssessmentPage.includeSanSections.setValue('')
            createAssessmentPage.create.click()
            oasys.Errors.checkErrorMessage('You must decide if you want to include strengths and needs before being able to create the assessment.')
            createAssessmentPage.includeSanSections.setValue('No')

            createAssessmentPage.create.click()
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')
            cy.get<Number>('@result').then((pk) => {

                cy.log(`A normal Layer 3 Version 1 assessment is created showing the Case ID Offender Information screen 
                        Do NOT change any data or navigate anywhere
                        Ensure the left hand navigation menu shows +Section 2 to 13 AND Self Assessment Form
                        Ensure there is no navigation option for 'Strengths and Needs Sections'
                        Check the OASYS_SET record has new field 'SAN_ASSESSMENT_LINKED_IND' SET to 'N'
                        Do not enter any data, go to a sentence plan screen and click on 'Sign and Lock' - ensure the errors reported are consistent with a 3.1 assessment type and there is nothing there to do with a SAN assessment`)

                new oasys.Pages.Assessment.OffenderInformation().checkCurrent()
                oasys.San.checkLayer3Menu(false)

                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, { SAN_ASSESSMENT_LINKED_IND: 'N' })

                const isp = new oasys.Pages.SentencePlan.IspSection52to8().goto()
                isp.signAndLock.click()
                oasys.Errors.checkSignAndLockErrorsVisible('section2To13Errors')
                oasys.Errors.checkSignAndLockErrorsNotVisible('sanSectionsIncomplete')
                new oasys.Pages.Signing.SigningStatus().returnToAssessment.click()

                cy.log(`Continue to complete the Layer 3 Version 1, doesn't matter what data you put in BUT make it a SEXUAL offence so that 1.30 = Yes and is read only.  Fully complete it by signing and locking, countersigning if necessary
                        Offender now has 1 completed Layer 3 Version 1 assessment
                        Check the database, ensure the OASYS_SET record still have the new field 'SAN_ASSESSMENT_LINKED_IND' set to 'N' AND there is NO section associated to it called 'SAN'
                        Check that on the SNS_MESSAGE table there are records for OGRS, RSR and AssSumm`)

                const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
                offendingInformation.setValues({
                    offence: '020', subcode: '01', count: '1', offenceDate: oasys.oasysDate({ months: -4 }), sentence: 'Fine',
                    sentenceDate: oasys.oasysDate({ months: -3 })
                })
                oasys.Populate.Layer3Pages.Predictors.fullyPopulated({ r1_30PrePopulated: true, r1_41PrePopulated: true })
                oasys.Populate.sections2To13NoIssues()
                oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
                oasys.Populate.Rosh.screeningNoRisks(true)

                isp.goto().agreeWithPlan.setValue('Yes')
                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu })
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])

                oasys.logout()
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, { SAN_ASSESSMENT_LINKED_IND: 'N' })
                oasys.Db.selectCount(`select count(*) from oasys_section where oasys_set_pk = ${pk} and ref_section_code = 'SAN'`, 'count')
                cy.get<number>('@count').then((count) => {
                    if (count! > 0) {
                        throw new Error(`Unexpected SAN section found for pk ${pk}`)
                    }
                })
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                oasys.logout()
            })
        })
    })
})