import * as dayjs from 'dayjs'
import * as oasys from 'oasys'

describe('SAN integration - test ref 38 part 2', () => {
    /**
     * Have a completed 3.2 assessment that has been countersigned.
     * Create a new 3.2 assessment and enter some data including SAN data.
     * Delete that second 3.2 assessment. 
     * Roll back the first 3.2 assessment and carry on with that does it work with SAN statuses?
     */

    it('Roll back the first assessment and check API calls and assessment status', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Db.getAllSetPksByPnc(offender.pnc, '[pks]')
            cy.get<number[]>('@[pks]').then((pks) => {  // [0] = the second deleted assessment, [1] = the first one that will be rolled back

                oasys.Assessment.openLatest()

                oasys.San.gotoSan()
                oasys.San.checkSanOtlCall(pks[1], {
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
                    'displayName': oasys.Users.admin.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 0
                )
                oasys.San.checkSanEditMode(false)
                oasys.San.returnToOASys()

                // Roll back the assessment
                oasys.Assessment.rollBack('Test 38 part 2 rolling back again, after deleting the second assessment')


                // Check OASYS_SET and API calls
                oasys.San.getSanApiTime(pks[1], 'SAN_GET_ASSESSMENT', 'getSanDataTime')
                cy.get<dayjs.Dayjs>('@getSanDataTime').then((sanDataTime) => {
                    oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pks[1]}`, {
                        SAN_ASSESSMENT_LINKED_IND: 'Y',
                        CLONED_FROM_PREV_OASYS_SAN_PK: null,
                        SAN_ASSESSMENT_VERSION_NO: null,
                        LASTUPD_FROM_SAN: sanDataTime
                    })
                })
                oasys.San.checkSanRollbackCall(pks[1], oasys.Users.admin, 0, 1)
                oasys.logout()

            })
        })
    })
})