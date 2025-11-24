import { OgrsTestParameters, ReportMode } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

const pk = 9559367
const reportMode: ReportMode = 'normal' 

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
        staticFlag: null,
        reportMode: reportMode,
        includeObjects: false,
    }

    it(`Assessment pk ${pk}`, () => {

        runTest(dbTestParams, '', false, false)
    })


}