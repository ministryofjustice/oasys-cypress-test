import * as dayjs from 'dayjs'
import * as oasys from 'oasys'

describe('SAN integration - test ref 49', () => {

    it('Test ref 49 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            cy.log(`Offender has a previous historic period of supervision where latest assessment is a 3.2 OASys-SAN `)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk1')

            cy.get<number>('@pk1').then((pk1) => {

                oasys.San.gotoSan()
                oasys.San.populateSanSections('Test ref 49', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()

                oasys.San.gotoSentencePlan()
                oasys.San.populateSanSections('Test ref 49 SP', oasys.Populate.San.SentencePlan.minimal)
                oasys.San.returnToOASys()

                // Complete section 1
                new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)

                const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})

                oasys.Populate.Rosh.screeningNoRisks(true)
                oasys.Nav.clickButton('Save')

                new oasys.Pages.SentencePlan.IspSection52to8().goto()
                oasys.Assessment.signAndLock()

                // Mark all assessments as historic

                oasys.Nav.history()
                new oasys.Pages.Assessment.Other.MarkAssessmentHistoric().goto().ok.click()

                cy.log(`Open up the offender record
                    Click on the <Open S&N> button - SAN opens in READ ONLY mode
                    Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is NULL
                    Return to OASys`)

                oasys.Nav.history(offender)
                oasys.Nav.clickButton('Open S&N')
                oasys.San.checkSanOtlCall(pk1, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                },
                    { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
                    'san', null
                )

                oasys.San.returnToOASys()

                cy.log(`Open the historic 3.2 assessment
                    Navigate out to the SAN Service via the screen - SAN opens in READ ONLY mode
                    Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is 0 (or whatever number is held on the OASYS_SET record)
                    Return to OASys
                    Navigate out to the Sentence Plan Service via the screen - Sentence Plan opens in READ ONLY mode
                    Ensure the OTL passes across READ_ONLY for the accessMode and the sentence plan version number is 0 (or whatever number is held on the OASYS_SET record)
                    Return to OASys`)

                oasys.Assessment.openLatest()

                oasys.San.gotoSan()
                oasys.San.checkSanOtlCall(pk1, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                },
                    { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
                    'san', 0
                )

                oasys.San.returnToOASys()

                oasys.San.gotoSentencePlan()
                oasys.San.checkSanOtlCall(pk1, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                },
                    { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'planAccessMode': 'READ_ONLY', },
                    'sp', 0
                )

                oasys.San.returnToOASys()

                oasys.Nav.clickButton('Close')

                cy.log(`For the assessment in a new period of supervision create a classic 3.1 OASys assessment
                    During the create process say 'Yes' to cloning from the historic 3.2 assessment`)

                oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' }, 'Yes')
                oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk2')

                cy.get<number>('@pk2').then((pk2) => {

                    cy.log(`Check the OASYS_SET record - field CLONED_FROM_PREV_OASYS_SAN_PK is set to the PK of the historic 3.2 assessment
                        Check other OASYS_SET record fields; SAN_ASSESSMENT_LINKED_IND is N, LASTUPD_FROM_SAN is populated,  retrieved the data but SAN_ASSESSMENT_VERSION_NO
                            AND SSP_PLAN_VERSION_NO are NULL.`)

                    oasys.San.getSanApiTime(pk1, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
                    cy.get<dayjs.Dayjs>('@getSanDataTime').then((sanDataTime) => {
                        oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk2}`, {
                            SAN_ASSESSMENT_LINKED_IND: 'N',
                            CLONED_FROM_PREV_OASYS_SAN_PK: pk1.toString(),
                            SAN_ASSESSMENT_VERSION_NO: null,
                            SSP_PLAN_VERSION_NO: null,
                            LASTUPD_FROM_SAN: sanDataTime,
                        })
                    })

                    cy.log(`Check that there are NO OASYS_SECTION records for 'SAN' or 'SSP'
                        Check that on any cloned through OASYS_SECTION records the fields 'SAN_CRIM_NEED_SCORE' have been nulled out
                        Check that the OASys sections has data cloned from the historic 3.2 assessment (confirmed by GetAssessment call and completion of some mandatory questions)`)

                    oasys.Db.selectCount(`select count(*) from oasys_section where oasys_set_pk = ${pk2} and ref_section_code in ('SAN','SSP')`, 'count')
                    cy.get<number>('@count').then((count) => {
                        if (count! > 0) {
                            throw new Error(`Unexpected SAN/SSP section found for pk ${pk2}`)
                        }
                    })

                    oasys.Db.selectCount(`select count(*) from oasys_section where san_crim_need_score is not null and oasys_set_pk = ${pk2};`, 'count')
                    cy.get<number>('@count').then((count) => {
                        if (count! > 0) {
                            throw new Error(`Unexpected san_crim_need_score found for pk ${pk2}`)
                        }
                    })

                    oasys.San.checkSanGetAssessmentCall(pk1, 0)

                    cy.log(`Complete the 3.1 assessment and then fully sign and lock and countersign (if applicable) the 3.1 assessment.`)

                    new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)
                    predictors.goto()
                    predictors.o1_32.setValue(3)
                    predictors.o1_40.setValue(0)
                    predictors.o1_29.setValue({ days: -10 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({ months: 6 })
            const section2 = new oasys.Pages.Assessment.Section2().goto()
            section2.briefOffenceDetails.checkValue('Offence description') // Confirms cloning from historic SAN
            section2.o2_14.setValue('No')
            oasys.Populate.Layer3Pages.Section3.noIssues()
            oasys.Populate.Layer3Pages.Section4.noIssues()
            oasys.Populate.Layer3Pages.Section5.noIssues()
            oasys.Populate.Layer3Pages.Section6.noIssues()
            oasys.Populate.Layer3Pages.Section7.noIssues()
            oasys.Populate.Layer3Pages.Section9.noIssues()
            oasys.Populate.Layer3Pages.Section10.noIssues()
            oasys.Populate.Layer3Pages.Section11.noIssues()
            oasys.Populate.Layer3Pages.Section12.noIssues()
            oasys.Populate.CommonPages.SelfAssessmentForm.minimal()
            oasys.Populate.SentencePlanPages.IspSection52to8.minimal()
            oasys.Assessment.signAndLock()

            cy.log(`Now check the access to the SAN and Sentence Plan service again, now that we have a 3.1 assessment
                        Open up the offender record
                        Click on the <Open S&N> button - SAN opens in READ ONLY mode
                        Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is NULL
                        Return to OASys`)

            oasys.Nav.history(offender)
            oasys.Nav.clickButton('Open S&N')
            oasys.San.checkSanEditMode(false)

            oasys.San.checkSanOtlCall(pk1, {
                'crn': offender.probationCrn,
                'pnc': offender.pnc,
                'nomisId': null,
                'givenName': offender.forename1,
                'familyName': offender.surname,
                'dateOfBirth': offender.dateOfBirth,
                'gender': '1',
                'location': 'COMMUNITY',
                'sexuallyMotivatedOffenceHistory': 'NO',
            },
                { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
                'san', null
            )

            oasys.San.returnToOASys()

            cy.log(`Click on the <Open SP> button - Sentence Plan opens in READ ONLY mode
                        Ensure the OTL passes across READ_ONLY for the accessMode and the sentence plan version number is NULL
                        Return to OASys`)

            oasys.Nav.clickButton('Open SP')
            oasys.San.checkSentencePlanEditMode(false)

            oasys.San.checkSanOtlCall(pk1, {
                'crn': offender.probationCrn,
                'pnc': offender.pnc,
                'nomisId': null,
                'givenName': offender.forename1,
                'familyName': offender.surname,
                'dateOfBirth': offender.dateOfBirth,
                'gender': '1',
                'location': 'COMMUNITY',
                'sexuallyMotivatedOffenceHistory': 'NO',
            },
                { 'displayName': oasys.Users.probSanHeadPdu.forenameSurname, 'planAccessMode': 'READ_ONLY', },
                'san', null
            )

            oasys.San.returnToOASys()

            cy.log(`Open the historic 3.2 assessment
                        Navigate out to the SAN Service via the screen - SAN opens in READ ONLY mode
                        Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is 0 (or whatever number is held on the OASYS_SET record)
                        Return to OASys
                        Navigate out to the Sentence Plan Service via the screen - Sentence Plan opens in READ ONLY mode
                        Ensure the OTL passes across READ_ONLY for the accessMode and the sentence plan version number is 0 (or whatever number is held on the OASYS_SET record)
                        Return to OASys`)

            oasys.Assessment.open(2)  // Row 1 is the 3.1 assessment, row 2 is historic 3.2

            oasys.San.gotoSan()
            oasys.San.checkSanOtlCall(pk1, {
                'crn': offender.probationCrn,
                'pnc': offender.pnc,
                'nomisId': null,
                'givenName': offender.forename1,
                'familyName': offender.surname,
                'dateOfBirth': offender.dateOfBirth,
                'gender': '1',
                'location': 'COMMUNITY',
                'sexuallyMotivatedOffenceHistory': 'NO',
            }, {
                'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                'accessMode': 'READ_ONLY',
            },
                'san', 0
            )

            oasys.San.returnToOASys()

            oasys.San.gotoSentencePlan()
            oasys.San.checkSanOtlCall(pk1,
                {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                },
                {
                    'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                    'planAccessMode': 'READ_ONLY',
                },

                'sp', 0
            )

            oasys.San.returnToOASys()

            oasys.logout()

        })
    })
})
    })
})
