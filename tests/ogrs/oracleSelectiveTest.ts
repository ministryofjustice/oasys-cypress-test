import { OgrsTestParameters, ReportMode } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

const pk = 2513831341
const reportMode: ReportMode = 'verbose' 

describe('OGRS calculator test', () => {

    runTests()
})


function runTests() {

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
    }

    it(`Assessment pk ${pk}`, () => {

        runTest(dbTestParams, '', false, false)
    })


}