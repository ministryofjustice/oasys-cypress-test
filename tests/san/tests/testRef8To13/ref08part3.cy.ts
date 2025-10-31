import * as oasys from 'oasys'
import * as testData from '../../data/testRef8'

describe('SAN integration - test ref 08 part 3', () => {

    it('Test ref 8 part 3 - Complete SAN assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.openLatest()

            cy.log(`Now go back to the 'Strengths and Needs Sections' screen
                    Click on the button <Open Strengths and Needs> - launches into the SAN Assessment.  Answer all questions with whatever you like BUT at all the 'Is this area linked to risk of serious harm?' answer 'No'
                    As you go through take screenshots of those SAN section screens that show the 'risk', 'reoffending', 'strengths/protective factors' and 'risk not related' questions (for checking against our Summary Screen later on)
                    When you have fully completed the SAN Assessment, return back to the OASys part of the assessment via the button/link
                    As part of the return back from SAN OASys will automatically retrieve the latest data from SAN (for this we will assume it is correct in the database)
                    The navigation menu is now showing a green tick against the 'Strengths and Needs Sections' option
                    A full analysis has NOT been invoked`)

            oasys.San.gotoSan()
            oasys.San.populateSanSections('TestRef8 complete SAN', testData.sanPopulation)
            oasys.San.returnToOASys()
            oasys.Nav.clickButton('Next')
            new oasys.Pages.Assessment.SanSections().checkCompletionStatus(true)
            new oasys.Pages.Rosh.RiskManagementPlan().checkIsNotOnMenu()

            cy.log(`Go to the Summary Sheet screen
                    There is NO <Summary Sheet> button BUT there is a <Print > button.
                    There is NO 3.1 'Criminogenic Needs Summary and Section Scores', NO 'Low scoring areas that may need attention in the sentence plan' and NO 'Reasons for Low Scoring Areas 
                        needing attention in the sentence plan'
                    At the top of the screen is a new section called 'Criminogenic Needs Summary and Scores' and lists each of the strengths and needs sections apart from 'Offence analysis' 
                        and includes at the bottom a row for 'Lifestyle & Associates' which is not a specific SAN Section
                    Check that this section is showing names of the SAN Assessment sections and that results are correct for the THREE columns according to the screenshots taken earlier on.
                        The 'Lifestyle & Associates' row will show 'N/A' for the first THREE columns in this table. 
                    Check that the section is showing the threshold scores correctly, including 'Lifestyle & Associates' - will need to check against the NEW 'crim need scores'
                        questions stored in the database and prove they are correct from the SAN assessment data
                    Check that the next 'Predictors' section is showing scores for OGRS3, OGP, OVP, OSP-IIC, OSP-DC and RSR
                    Carry out a manual check to ensure that the OGP and OVP scores are correct to the FAST algorithm calculation - 
                    will need to interogate the OASys database and use the 'L3.2 OGP and OVP FAST calculator.xls' spreadsheet to input the values and obtain the scores`)

            const summarySheet = new oasys.Pages.Assessment.SummarySheet().goto()
            summarySheet.summarySheet.checkStatus('notVisible')
            summarySheet.print.checkStatus('enabled')

            const expectedValues: ColumnValues[] = [
                {
                    name: 'oasysSection',
                    values: ['Accommodation', 'Employment and education', 'Finance', 'Drug use', 'Alcohol use', 'Health and wellbeing', 'Personal relationships and community', 'Thinking, behaviours and attitudes', 'Lifestyle & Associates']
                },
                {
                    name: 'criminogenicNeed',
                    values: ['N', 'N', 'N/A', 'N', 'N', 'N/A', 'Y', 'Y', 'N']
                },
                {
                    name: 'scores',
                    values: ['0', '0', 'N/A', '0', '0', 'N/A', '4', '6', '0']
                }
            ]
            summarySheet.sanCrimTable.checkData(expectedValues)

            const expectedPredictorsValues: ColumnValues[] = [
                {
                    name: 'scoreDescription',
                    values: ['OGRS3 probability of proven reoffending', 'OGP probability of proven non-violent reoffending', 'OVP probability of proven violent-type reoffending', 'OSP Indecent Image and Indirect Contact Reoffending Risk', 'OSP Direct Contact Sexual Reoffending Risk', 'Risk of Serious Recidivism (RSR)']
                },
                {
                    name: 'oneYear',
                    values: ['18', '11', '11', 'N/A', 'N/A', 'N/A']
                },
                {
                    name: 'twoYear',
                    values: ['31', '19', '19', 'N/A', 'N/A', ' 10.07']
                },
                {
                    name: 'category',
                    values: ['Low', 'Low', 'Low', 'Medium', 'Very High', 'High  (DYNAMIC)']
                },
            ]
            summarySheet.predictorsTable.checkData(expectedPredictorsValues)

            cy.log(`There is NO 'weighted scores' section
                    There is a 'Likelihood of serious harm to others' section - ensure it states that 'There is no risk information to be displayed as the RoSH Screening does not indicate a Risk of Serious Harm, and a Full Analysis has not been undertaken.'
                    There is a 'Concerns' section which lists no concerns
                    There is a 'Learning Screening Tool' section which will list the outcome.  I cannot predict what it will be but the sentence will start with 'This individual….'.  If it starts with 'Not enough items….' then something is wrong because the entire assessment has been completed so it must be able to work it out.
                    There is an 'Offender Personality Disorder' section which will state 'This individual does not meet the criteria for the OPD pathway.'  
                    There is a 'Date Assessment Completed:' which does not have a date yet`)

            summarySheet.weighedScoresTable.checkVisibility(false)
            summarySheet.likelihoodHarmOthersTable.checkCount(0)
            summarySheet.likelihoodHarmOthersTable.checkText('There is no risk information to be displayed as the RoSH Screening does not indicate a Risk of Serious Harm, and a Full Analysis has not been undertaken.')
            summarySheet.concernsTable.checkCount(0)
            summarySheet.learningScreeningTool.checkValue('This individual may have some learning challenges. Further assessment may be needed to determine the support required.', true)
            summarySheet.opdOverrideMessage.checkValue('This individual does not meet the criteria for the OPD pathway.')
            summarySheet.dateCompleted.checkValue('\nDate Assessment Completed: \n')

            cy.log(`Click on the <Sign & Lock> button - no outstanding questions/warnings are given
                    User is given the 'Incomplete Sections Alert' - it is NOT showing Sections 2 to 13 and the Self Assessment Form.
                    It does NOT show the 'Strengths and Needs Sections' as this has a green tick and will always have to have that before it can be signed off.
                    Ensure that what is showing is: 1-Predictors, Initial Sentence Plan, Risk of Serious Harm Screening
                    Click on <Confirm Sign & Lock> - will ask for a countersigner
                    Leave the default countersigner and enter a countersign comment
                    Check that a 'Sign API' has been posted to the SAN Service and the contents are correct (status passed is 'SIGNED' along with the User ID and User name)`)

            // Complete SP, then sign and lock
            oasys.San.gotoSentencePlan()
            oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
            oasys.San.returnToOASys()

            oasys.Assessment.signAndLock({
                page: oasys.Pages.SentencePlan.IspSection52to8,
                expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: '3.2 assessment needs countersigning'
            })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')
            cy.get<number>('@pk').then((pk) => {
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '0'
                })
                oasys.logout()
            })
        })
    })
})