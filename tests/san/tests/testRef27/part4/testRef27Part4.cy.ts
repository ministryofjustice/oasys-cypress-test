import * as dayjs from 'dayjs'
import * as oasys from 'oasys'
import * as testData from '../../../data/testRef27'

describe('SAN integration - test ref 27', () => {

    it('Part 4', () => {

        cy.log(`Lock Incomplete a prison OASys-SAN assessment when creating a new assessment where the internal transfer has stalled`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`Create PRISON offender in a SAN PILOT Prison area whose latest assessment is a WIP OASys-SAN assessment (not signed and locked) and does NOT have a SARA.
                ALL the SAN data has been validated and the sentence plan has been agreed`)

            const offender: OffenderDef = JSON.parse(offenderData as string)

            // First delete the BCS as it prevents the transfer
            oasys.login(oasys.Users.admin, 'Altcourse (HMP)')
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.deleteLatest()
            oasys.logout()

            oasys.login(oasys.Users.prisSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                oasys.San.gotoSan()
                oasys.San.populateSanSections('TestRef27 part 1 complete SAN', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()
                oasys.San.gotoSentencePlan()
                oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Previous')

                oasys.Db.checkSingleAnswer(pk, '9', '9.2', 'refAnswer', '0')  // above population sets binge drinking to no

                cy.log(`Open up the offender record
                    From the offender record click on the <Open S&N> button - taken into the SAN Assessment in EDIT mode
                    Change or enter more data that will affect OASys into the SAN Assessment.  
                    Take screenshots of your input but do not click on <Save and Continue> - just navigate to a different screen - we need 'unvalidated' data
                    Return back to the Offender record`)

                oasys.Nav.clickButton('Close')
                oasys.Nav.clickButton('Open S&N')
                oasys.San.clearSANPrivacyDeclaration()
                oasys.San.populateSanSections('Test 27 part 4 SAN Alcohol', testData.test4ModifyAlcohol)
                oasys.San.returnToOASys()

                cy.log(`From the offender record click on the <Open SSP> button - taken into the Sentence Plan Service in EDIT mode
                    Change or enter more data that changes the sentence plan e.g. add an objective.  Take screenshots of your input but do not agree the plan
                    Return back to the Offender record`)

                oasys.Nav.clickButton('Open SP')
                oasys.San.clearSentencePlanPrivacyDeclaration()
                oasys.San.populateSanSections('Test 27 part 4 SP one goal', testData.test2SpCreateGoal)
                oasys.San.returnToOASys()
                oasys.logout()

                cy.log(`Using the CMS stub submit an internal reception event to a NON SAN PILOT Prison area
                     - the transfer will stall due to the WIP OASys assessment, the new prison will be noted in the 'Awaiting prison' field on the Offender Management tab
                    Now log in as a user to the 'awaiting' NON SAN PILOT prison area.  
                    Search for and open up the Offender record currently owned by the SAN Pilot probation area - will have 'full' access to the offender record`)

                oasys.login(oasys.Users.prisHomds)
                offender.receptionCode = 'TRANSFER IN FROM OTHER ESTABLISHMENT'
                oasys.Offender.enterPrisonStubDetailsAndCreateReceptionEvent(offender)
                oasys.Offender.searchAndSelectByPnc(offender.pnc, 'Altcourse (HMP)')
                const offenderDetails = new oasys.Pages.Offender.OffenderDetails()
                offenderDetails.offenderManagementTab.click()
                new oasys.Pages.Offender.OffenderManagementTab().awaitingPrisonOwner.checkValue('Kirklevington (HMP)')

                cy.log(`Click on the <Create Assessment> button - shown 'Work In Progress Assessment at another Establishment…. Recording (Work in Progress)….' message
                    Click on the <Lock Incomplete> button - returns back to the Offender record
                    The user now has full access to the offender and the assessment is showing as Locked Incomplete
                    The controlling owner is now set to the Awaiting Prison Owner`)

                oasys.Nav.clickButton('Create Assessment')
                oasys.Nav.clickButton('Lock Incomplete')
                offenderDetails.controllingOwner.checkValue('Kirklevington (HMP)')

                cy.log(`Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'
                    Check that Get Assessment has occurred BEFORE locking incomplete
                    A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                    Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' populate by the return API response
                    Check the database for the assessment and it shows data mapped from the updates carried out on the offender record
                        above before the assessment was locked incomplete
                    Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                    Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                    Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                oasys.Db.getData(`select to_char(lastupd_date, 'YYYY-MM-DD HH24:MI:SS') from oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate')
                cy.get<string[][]>('@lastUpdDate').then((initialData) => {

                    const lastUpdDate = dayjs(initialData[0][0], 'YYYY-MM-DD HH:mm:ss')

                    oasys.San.checkSanGetAssessmentCall(pk, 0)
                    oasys.San.checkSanLockIncompleteCall(pk, oasys.Users.prisHomds, 0, 0)

                    oasys.San.getSanApiTime(pk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
                    oasys.San.getSanApiTime(pk, 'SAN_LOCK_INCOMPLETE', 'lockIncompleteTime')
                    cy.get<dayjs.Dayjs>('@getSanDataTime').then((getSanDataTime) => {
                        cy.get<dayjs.Dayjs>('@lockIncompleteTime').then((lockIncompleteTime) => {
                            expect(lockIncompleteTime.diff(getSanDataTime)).gt(0)
                        })
                    })

                    oasys.Db.checkSingleAnswer(pk, '9', '9.2', 'refAnswer', '2')  // change from offender record sets binge drinking

                    oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                        SAN_ASSESSMENT_LINKED_IND: 'Y',
                        CLONED_FROM_PREV_OASYS_SAN_PK: null,
                        SAN_ASSESSMENT_VERSION_NO: '0',
                        SSP_PLAN_VERSION_NO: '0',
                    })

                    const sectionQuery = `select count(*) from oasys_section where oasys_set_pk = ${pk} 
                                                and section_status_elm = 'COMPLETE_LOCKED' and ref_section_code in ('SAN', 'SSP')`

                    oasys.Db.selectCount(sectionQuery, 'sections')
                    cy.get<number>('@sections').then((sections) => {
                        expect(sections).equal(2)
                    })
                    oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                    cy.log(`Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
                        Click on the 'Open Strengths and Needs' button
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment 
                            shows correctly including the 'unvalidated' data that was captured in screenshots above (this proves that the SAN service ARE 
                            creating versions of the SAN assessment with unvalidated data in it)
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format and you 
                            can see the screenshot changes that were made above
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                    oasys.Assessment.openLatest()
                    oasys.San.gotoReadOnlySan()
                    oasys.San.checkSanEditMode(false)
                    oasys.San.goto('Alcohol use')
                    oasys.San.checkReadonlyText(
                        'Has TestRefTwentySeven-Four shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
                        'Evidence of binge drinking or excessive alcohol use')
                    oasys.San.returnToOASys()

                    oasys.San.gotoReadOnlySentencePlan()
                    oasys.San.checkSentencePlanEditMode(false)
                    oasys.San.checkSPGoalCount(1, 1)
                    oasys.San.returnToOASys()

                    oasys.Nav.clickButton('Close')

                    cy.log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
                             and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`)

                    const questionsQuery = `select max(to_char(q.lastupd_date, 'YYYY-MM-DD HH24:MI:SS')) from oasys_set st, oasys_section s, oasys_question q
                             where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                             and st.oasys_set_pk = ${pk}`

                    oasys.Db.getData(questionsQuery, 'questions')
                    oasys.Db.getData(`select lastupd_from_san, lastupd_date from oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate2')
                    cy.get<string[][]>('@questions').then((questions) => {
                        cy.get<string[][]>('@lastUpdDate2').then((updatedSetData) => {

                            const latestQuestionUpdDate = dayjs(questions[0][0], 'YYYY-MM-DD HH:mm:ss')
                            const lastUpdFromSan = dayjs(updatedSetData[0][0], 'YYYY-MM-DD HH:mm:ss')
                            const lastUpdDate2 = dayjs(updatedSetData[0][1], 'YYYY-MM-DD HH:mm:ss')

                            expect(latestQuestionUpdDate.diff(lastUpdDate)).lte(0)
                            expect(lastUpdFromSan.diff(lastUpdDate)).lte(0)
                            expect(lastUpdDate2.diff(lastUpdDate)).lte(0)

                            oasys.logout()
                        })
                    })
                })
            })
        })
    })
})
