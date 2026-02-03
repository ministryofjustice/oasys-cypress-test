import { TieringTestParameters, TieringTestResult } from '../../oasys/ogrs/types'

const count = 260000
const timeout = 10000000

describe('Tier calculations test', () => {

    const testParams: TieringTestParameters = {
        // whereClause: `ignore <> 'Y' and run_number = 4`,
        whereClause: `ignore = 'N' or ignore is null`,
        // whereClause : `cms_prob_number = 'V166775'`,
        count: count,
    }

    it(`Tiering calculation`, () => {

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