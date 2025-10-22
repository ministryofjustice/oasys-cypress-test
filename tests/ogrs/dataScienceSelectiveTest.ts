import { OgrsTestParameters } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

describe('OGRS calculator test - data science test cases', () => {

    const start = 0
    const end  = 1000

    it('Data science test cases - static flag = N', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'N',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.start = start
        csvTestParams.csvDetails.end = end
        runTest(csvTestParams, null, false, false)
    })

    it('Data science test cases - static flag = Y', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'Y',
            reportMode: 'normal',
        }

        csvTestParams.csvDetails.start = start
        csvTestParams.csvDetails.end = end
        runTest(csvTestParams, null, false, false)
    })
})