import { TieringTestParameters, TieringTestResult } from '../../oasys/lib/ogrs/types'

const count = 260000
const timeout = 10000000

describe('Tier calculations test', () => {

    const testParams: TieringTestParameters = {
        whereClause: `ignore <> 'Y'`,
        count: count,
    }

    it(`Layer 3 v1 complete`, () => {

        let failed = false
        cy.task('tieringTest', testParams, { timeout: timeout }).then((result: TieringTestResult) => {

            cy.groupedLogStart(` `)

            result.logText.forEach((log) => {
                cy.groupedLog(log)
            })
            cy.groupedLogEnd()
            cy.log(`Passed: ${result.passed}, failed: ${result.failed}`)
            cy.task('consoleLog', `Passed: ${result.passed}, failed: ${result.failed}`)
            failed = result.failed > 0

        }).then(() => {
            expect(failed).to.be.false
        })

    })

})