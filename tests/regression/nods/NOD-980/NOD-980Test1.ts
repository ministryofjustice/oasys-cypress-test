import * as oasys from 'oasys'

describe('NOD-980: Test for RA cloning 1', () => {


    it('RoSHA with 1.39 = NO -> RoSHA', () => {

        oasys.login(oasys.Users.probHeadPdu)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // First RoSHA
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

            oasys.Db.getLatestSetPk('@offender1', 'pk')
            cy.get<number>('@pk').then((pk) => {
                oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).equal(false)
                })

                oasys.Populate.minimal({ layer: 'Layer 1V2' })
                oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RoshScreeningSection5, expectRsrScore: true })
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

                // Second RoSHA
                oasys.Nav.history(offender)
                oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
                oasys.Db.getLatestSetPk('@offender1', 'pk')
                cy.get<number>('@pk').then((pk) => {
                    oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                    cy.get<boolean>('@failed').then((failed) => {
                        expect(failed).equal(false)
                    })
                    oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RoshScreeningSection5, expectRsrScore: true })

                    oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                    cy.get<boolean>('@failed').then((failed) => {
                        expect(failed).equal(false)
                    })
                    oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
                })

            })
        })

    })

})