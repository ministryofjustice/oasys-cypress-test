import { OgrsTestParameters, ReportMode } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

const pk = 1114639
const reportMode: ReportMode = 'normal' 

describe('OGRS calculator test - static flag = N', () => {

    runTests('N')
})

describe('OGRS calculator test - static flag = Y', () => {

    runTests('Y')
})

function runTests(staticFlag: 'Y' | 'N') {

    const dbTestParams: OgrsTestParameters = {
        testType: 'db',
        dbDetails: {
            type: 'assessment',
            whereClause: `oasys_set_pk = ${pk}`,
            count: 1,
        },
        staticFlag: staticFlag,
        reportMode: reportMode,
    }

    it(`Assessment pk ${pk}`, () => {

        runTest(dbTestParams, '', false, false)
    })


}