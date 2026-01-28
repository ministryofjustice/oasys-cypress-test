import { OgrsTestParameters, ReportMode } from '../../oasys/ogrs/types'
import { runTest } from './testLib'

const pk = 4192308
const reportMode: ReportMode = 'verbose'

describe('OGRS calculator test', () => {

    it(`Assessment pk ${pk}`, () => {

        cy.get<AppConfig>('@appConfig').then((appConfig) => {

            const dbTestParams: OgrsTestParameters = {
                testType: 'db',
                dbDetails: {
                    type: 'assessment',
                    whereClause: `oasys_set_pk = ${pk}`,
                    count: 1,
                },
                staticFlag: 'N',
                reportMode: reportMode,
                includeObjects: true,
                appConfig: appConfig,
            }

            runTest(dbTestParams, '', false, false)
        })
    })
})

