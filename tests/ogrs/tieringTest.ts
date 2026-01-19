import { TieringTestParameters, TieringTestResult } from '../../cypress/support/ogrs/types'

const count = 260000
const timeout = 10000000

describe('Tier calculations test', () => {

    const testParams: TieringTestParameters = {
        whereClause: `ignore <> 'Y'`,
        // whereClause: `ignore <> 'Y' and (MAPPA <> 'Y' OR COALESCE(ROSH, ROSH_LEVEL_ELM) <> 'H')`,
        // whereClause: `cms_prob_number = 'D932782'`,
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