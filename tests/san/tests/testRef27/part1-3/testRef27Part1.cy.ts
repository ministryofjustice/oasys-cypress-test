import * as dayjs from 'dayjs'
import * as oasys from 'oasys'

describe('SAN integration - test ref 27', () => {

    it('Part 1', () => {

        cy.log(`Lock Incomplete OASys-SAN assessment (no SARA) from the Offender's Assessments Tab - SAN Data Validated, Sentence Plan has been agreed`)

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.
                ALL the SAN data has been validated, sentence plan has been agreed.`)

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                oasys.San.gotoSan()
                oasys.San.populateSanSections('TestRef27 part 1 complete SAN', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()
                oasys.San.gotoSentencePlan()
                oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
                oasys.San.returnToOASys()

                cy.log(`Open up the offender record
                    Click on the <Lock Incomplete> button and then click <OK> to confirm the action
                    Assessment now showing as locked incomplete
                    Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`)

                oasys.Nav.clickButton('Close')
                oasys.Assessment.lockIncomplete()

                oasys.Db.getData(`select to_char(lastupd_date, 'YYYY-MM-DD HH24:MI:SS')  from oasys_set where oasys_set_pk = ${pk}`, 'lastUpdDate')
                cy.get<string[][]>('@lastUpdDate').then((initialData) => {

                    const lastUpdDate = dayjs(initialData[0][0], 'YYYY-MM-DD HH:mm:ss')

                    cy.log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
                        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
                        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
                        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                    oasys.San.checkSanLockIncompleteCall(pk, oasys.Users.probSanUnappr, 0, 0)
                    oasys.San.getSanApiTime(pk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
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
                        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
                        Return back to the OASys part of the assessment
                        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                        Close the assessment - back to the offender record`)

                    oasys.Assessment.openLatest()
                    oasys.San.gotoReadOnlySan()
                    oasys.San.checkSanEditMode(false)
                    oasys.San.returnToOASys()

                    oasys.San.gotoReadOnlySentencePlan()
                    oasys.San.checkSentencePlanEditMode(false)
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

                            cy.log(`Rollback the locked incomplete assessment
                            Ensure the SAN service respond with a 200
                            Lock incomplete the assessment again without any changes - ensure the SAN Service respond accordingly with a 200`)

                            oasys.logout()
                            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                            oasys.Offender.searchAndSelectByPnc(offender.pnc)
                            oasys.Assessment.openLatest()
                            oasys.Assessment.rollBack('Test 27 part 1')
                            oasys.San.checkSanRollbackCall(pk, oasys.Users.admin, 0, 0)
                            oasys.Nav.clickButton('Close')
                            oasys.Assessment.lockIncomplete()
                            oasys.San.checkSanLockIncompleteCall(pk, oasys.Users.admin, 0, 0)

                            // Delete assessment in preparation for part 2
                            oasys.Assessment.deleteLatest()

                            oasys.logout()
                        })
                    })
                })
            })
        })
    })
})
