import * as oasys from 'oasys'

describe('SAN integration - test ref 21 part 4', () => {

    /**
     * Merged offender has 7 assessments (latest on top)
     *  - 3.2 (Durham)
     *  - 3.2 (Durham)
     *  - 3.1 (Bedfordshire)
     *  - 3.2 (Durham)
     *  - 3.1 (Durham)
     *  - L1 (Durham)
     *  - 3.1 (Bedfordshire - offender 1)
     */

    it('Test ref 21 part 4 - check assessments', () => {

        // Get offender details and assessment PKs

        cy.task('retrieveValue', 'offender2').then((offenderData) => {
            const offender2: OffenderDef = JSON.parse(offenderData as string)
            oasys.Db.getAllSetPksByPnc(offender2.pnc, 'mergedOffenderPks', true)
            cy.get<number[]>('@mergedOffenderPks').then((mergedOffenderPks) => {
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Offender.searchAndSelectByPnc(offender2.pnc)

                const assessmentsTab = new oasys.Pages.Offender.AssessmentsTab()
                assessmentsTab.assessments.checkCount(7)

                cy.log(`Check each of the 3.2 assessments - ensure you can open them up (READ ONLY) and navigate out to the SAN Service which opens that 
                    version of the SAN assessment in READ ONLY MODE`)

                // 4th assessment (3rd from offender 2)
                assessmentsTab.assessments.clickNthRow(4)
                checkAssessment(offender2, mergedOffenderPks[3], 0, 0)
                oasys.Nav.clickButton('Close')

                // 6th assessment (5rd from offender 2)
                assessmentsTab.assessments.clickNthRow(2)
                checkAssessment(offender2, mergedOffenderPks[1], 1, 2)
                oasys.Nav.clickButton('Close')

                // 7th assessment (6th from offender 2)
                assessmentsTab.assessments.clickNthRow(1)
                checkAssessment(offender2, mergedOffenderPks[0], 2, 4)
                oasys.Nav.clickButton('Close')

                oasys.logout()
            })
        })
    })
})

function checkAssessment(offender: OffenderDef, pk: number, assessmentVersion: number, spVersion: number) {

    cy.log(`Checking assessment pk ${pk}`)
    oasys.San.gotoSan()
    oasys.San.checkSanOtlCall(pk,
        {
            'crn': offender.probationCrn,
            'pnc': offender.pnc,
            'nomisId': null,
            'givenName': offender.forename1,
            'familyName': offender.surname,
            'dateOfBirth': offender.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
            'accessMode': 'READ_ONLY',
        },
        'san', assessmentVersion
    )
    oasys.San.checkSanEditMode(false)
    oasys.San.returnToOASys()

    oasys.San.gotoSentencePlan()
    oasys.San.checkSanOtlCall(pk,
        {
            'crn': offender.probationCrn,
            'pnc': offender.pnc,
            'nomisId': null,
            'givenName': offender.forename1,
            'familyName': offender.surname,
            'dateOfBirth': offender.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
            'planAccessMode': 'READ_ONLY',
        },
        'sp', spVersion
    )
    oasys.San.checkSentencePlanEditMode(false)
    oasys.San.returnToOASys()
}