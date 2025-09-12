import * as oasys from 'oasys'

describe('SAN integration - tests 39/40', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     */

    it('Merge tests part 5 - demerge offenders', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1 = JSON.parse(offenderData as string)
            cy.task('retrieveValue', 'offender2').then((offenderData) => {
                const offender2 = JSON.parse(offenderData as string)

                // Get current assessment PKs
                oasys.Db.getLatestSetPkByPnc(offender1.pnc, 'currentOff1Pk')
                oasys.Db.getAllSetPksByPnc(offender2.pnc, 'currentOff2Pks', true)
                cy.get<number>('@currentOff1Pk').then((currentOff1Pk) => {
                    cy.get<number[]>('@currentOff2Pks').then((currentOff2Pks) => {

                        oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                        oasys.Offender.searchAndSelectByPnc(offender2.pnc)

                        // Demerge
                        oasys.Nav.clickButton('Demerge')
                        oasys.Nav.clickButton('Confirm Demerge')
                        oasys.Nav.clickButton('Demerge')
                        cy.get('#apexConfirmBtn').click()
                        oasys.Nav.clickButton('Close')
                        oasys.logout()

                        // Get new assessment PKs
                        oasys.Db.getLatestSetPkByPnc(offender1.pnc, 'newOff1Pk')
                        oasys.Db.getAllSetPksByPnc(offender2.pnc, 'newOff2Pks', true)
                        cy.get<number>('@newOff1Pk').then((newOff1Pk) => {
                            cy.get<number[]>('@newOff2Pks').then((newOff2Pks) => {

                                oasys.San.checkSanMergeCall(oasys.Users.admin, [
                                    { old: currentOff1Pk, new: newOff1Pk },
                                    { old: currentOff2Pks[1], new: newOff2Pks[1] },
                                ])

                            })
                        })

                    })

                })
            })
        })
    })
})