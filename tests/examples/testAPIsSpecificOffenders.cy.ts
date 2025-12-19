import * as oasys from 'oasys'

/**
 * Tests all endpoints against one or more specific oasys.Offender.
 */
describe('RestAPI regression tests', () => {


    const testCases = [,
        ['X770507', null],
        // ['VU48912', null],
        // ['YL32101', null],
        // ['', ''],      

    ]

    it(`All endpoint regression tests - extra test for specific cases`, () => {
        runTest(testCases)
    })

    function runTest(offenders: string[][]) {

        let failed = false
        let count = 1

        offenders.forEach((offender) => {
            cy.task('consoleLog', `Offender ${count++}: ${offender[0]} / ${offender[1]}`)

            if (offender[0] != null) {  // call with probation CRN
                oasys.Api.testOneOffender(offender[0], 'prob', 'probationFailedAlias', false)
                cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                    if (offenderFailed) {
                        cy.task('consoleLog', 'Failed')
                        failed = true
                    }
                })
            }
            if (offender[1] != null) {  // call with NomisId
                oasys.Api.testOneOffender(offender[1], 'pris', 'prisonFailedAlias', offender[0] != null)  // skipPrisSubsequents if already done for prob crn
                cy.get<boolean>('@prisonFailedAlias').then((offenderFailed) => {
                    if (offenderFailed) {
                        cy.task('consoleLog', 'Failed')
                        failed = true
                    }
                })
            }
        })
        cy.then(() => { if (failed) throw new Error('Error running RestAPI tests.') })
    }

})
