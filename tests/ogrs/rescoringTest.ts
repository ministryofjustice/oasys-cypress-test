import { RescoringResult, RescoringTestParameters } from '../../cypress/support/ogrs/types'

describe('OGRS rescoring datafix test', () => {

    test(1)
})

function test(part: number) {

    it(`Rescoring test, part ${part}`, () => {

        cy.get<AppConfig>('@appConfig').then((appConfig) => {

            const testParams: RescoringTestParameters = {
                dataFile: 'rescoringCRNs',
                start: null,
                end: null,
                staticFlag: 'N',
                includeLayer1: true,
                useCurrentDate: true,
                reportMode: 'normal',
                significantReleaseDates: appConfig.significantReleaseDates
            }

            runTest(testParams, `rescoringOutput`)
        })
    })
}


const timeout = 10000000
const summaryOutputItems = ['SNSV_PERCENTAGE_STATIC', 'SNSV_PERCENTAGE_DYNAMIC', 'OGRS4V_PERCENTAGE', 'OVP2_PERCENTAGE', 'OGRS4G_PERCENTAGE', 'OGP2_PERCENTAGE',]

export function runTest(params: RescoringTestParameters, outputFile: string) {

    cy.task('rescoringTest', params, { timeout: timeout }).then((results: RescoringResult[]) => {

        for (let i = 0; i < results.length; i++) {
            const result = results[i]
            cy.groupedLogStart(`CRN: ${result.crn}, pk: ${result.pk}`)
            cy.groupedLog(`Old predictors: ${result.existingPredictors}`)
            cy.groupedLog(`New predictors: ${result.newPredictors}`)
            cy.groupedLogEnd()
        }
    })
}
