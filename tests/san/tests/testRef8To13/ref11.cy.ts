import * as dayjs from 'dayjs'
import * as oasys from 'oasys'
import * as testData from '../../data/testRef11'


describe('SAN integration - test ref 11', () => {

    it('Test ref 11 - Transfer to non-pilot area and complete 3.1 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`Log in as an Assessor from a Non-Pilot probation area
                    Find the offender used in Test Ref 10
                    Carry out a 'transfer' so that the probation owner and controlling owner transfers to the non-pilot area.`)

            oasys.login(oasys.Users.probHeadPdu)
            oasys.Offender.searchAndSelectByPnc(offender.pnc, oasys.Users.probationSan)
            new oasys.Pages.Offender.OffenderDetails().requestTransfer.click()

            new oasys.Pages.Offender.RequestTransfer().submit.click()
            oasys.logout()

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Task.search({ taskName: 'Transfer Request Received - Decision Required', offenderName: offender.surname })
            oasys.Task.selectFirstTask()
            new oasys.Pages.Tasks.TransferDecisionTask().grantTransfer.click()
            oasys.logout()

            oasys.login(oasys.Users.probHeadPdu)

            cy.log(`Create a new 'Review' Layer 3 version 1 assessment - opens at the Case ID screen.  3.1 assessment includes a full analysis with sections 6.1 and 6.2.  
                    Sections 2 to 13 and the SAQ are showing in the navigation menu.  'Open Strengths and Needs' is NOT shown in the navigation menu.
                    Part of create will go and retrieve the latest validated set of SAN data.
                    Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been set to the PK of of the last OASys-SAN assessment, 
                    fields SAN_ASSESSMENT_LINKED_IND, LASTUPD_FROM_SAN and SAN_ASSESSMENT_VERSION_NO are all NULL.
                    Check that the 'NON OASYS' fields as listed in the analysis document have been deleted from the database.
                    Check that the LAST THREE questions in Sections 7, 11 and 12 have ALL been set by the SAN data and are the same;  'identify' text box, 'linked to risk of serious harm...' 
                    and 'linked to reoffending...'  (note: this is coming from the TBA section in the SAN Assessment and, rightly or wrongly, Cindy wanted it mapped to ALL 3 sections in OASys).`)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })

            oasys.San.checkLayer3Menu(false)
            new oasys.Pages.Rosh.RoshFullAnalysisSection61().checkIsOnMenu()

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')
            cy.get<number[]>('@pks').then((pks) => {
                const pk = pks[0]
                const prevPk = pks[1]

                oasys.San.getSanApiTime(prevPk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
                cy.get<dayjs.Dayjs>('@getSanDataTime').then((sanDataTime) => {
                    //cloning - section 1, case ID, RoSH screening
                    oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                        SAN_ASSESSMENT_LINKED_IND: null,
                        CLONED_FROM_PREV_OASYS_SAN_PK: prevPk.toString(),
                        SAN_ASSESSMENT_VERSION_NO: null,
                        LASTUPD_FROM_SAN: sanDataTime
                    })
                })

                oasys.Db.checkAnswers(pk, testData.nonOASysQuestions, 'nonOASysQuestionsResult', true)
                cy.get<boolean>('@nonOASysQuestionsResult').then((failed) => {
                    expect(failed).equal(false)
                })

                cy.log(`Go to the RoSH Screening Section 1 and check that at R1.1 it has area of concern set to '3 - Accommodation', 
                            '7 - Lifestyle and Associates', '11 - Thinking and Behaviour', '12 - Attitudes'
                        Carry on to fully complete the 3.1 assessment in OASys ensuring at S&L the Assessor DOES NOT receive any errors relating to the SAN service.`)

                const rosh1 = new oasys.Pages.Rosh.RoshScreeningSection1().goto()
                rosh1.areasOfConcern.getValues('areas')
                cy.get<string[]>('@areas').then((areas) => {
                    expect(areas).contains('7 - Lifestyle and Associates').and.contains('11 - Thinking and Behaviour').and.contains('12 - Attitudes')
                })

                // Complete remaining mandatory fields that didn't get cloned from the previous assessment
                const section2 = new oasys.Pages.Assessment.Section2().goto()

                section2.o2_2Weapon.setValue('No')
                section2.o2_2Arson.setValue('No')
                section2.o2_9Emotional.setValue('No')
                section2.o2_14.setValue('No')
                section2.identifyIssues.setValue('Section 2 issues')
                const victim = new oasys.Pages.Assessment.Other.Victim().goto()
                victim.relationship.setValue('Spouse/Partner - live in')
                victim.save.click()
                victim.close.click()

                new oasys.Pages.Assessment.Section3().goto().o3_5.setValue('0-No problems')
                const section4 = new oasys.Pages.Assessment.Section4().goto()
                section4.o4_5.setValue('0-No problems')
                section4.o4_5.setValue('0-No problems')
                section4.identifyIssues.setValue('No issues')
                new oasys.Pages.Assessment.Section5().goto().identifyIssues.setValue('No issues')
                new oasys.Pages.Assessment.Section6().goto().identifyIssues.setValue('No issues')
                const section9 = new oasys.Pages.Assessment.Section9().goto()
                section9.o9_3.setValue('0-No problems')
                section9.identifyIssues.setValue('No issues')
                const section10 = new oasys.Pages.Assessment.Section10().goto()
                section10.o10_3.setValue('0-No problems')
                section10.o10_7Medication.setValue('No')
                section10.o10_7Patient.setValue('No')
                section10.identifyIssues.setValue('No issues')
                const section11 = new oasys.Pages.Assessment.Section11().goto()
                section11.o11_1.setValue('0-No problems')
                section11.o11_5.setValue('0-No problems')
                const section12 = new oasys.Pages.Assessment.Section12().goto()
                section12.o12_5.setValue('0-No problems')
                section12.o12_8.setValue('1-Quite motivated')
                new oasys.Pages.Assessment.SelfAssessmentForm().goto().whyNotCompleted.setValue(`Didn't want to complete it`)

                oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection1to2 })
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: null,
                    CLONED_FROM_PREV_OASYS_SAN_PK: prevPk.toString(),
                    SAN_ASSESSMENT_VERSION_NO: null,
                })
                oasys.logout()
            })

        })
    })
})