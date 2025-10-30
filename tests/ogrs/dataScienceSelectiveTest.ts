import { OgrsTestParameters } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

describe('OGRS calculator test - data science test cases', () => {

    const start = 0
    const end  = 1999

    it('Data science test cases - static flag = N', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'N',
            reportMode: 'normal',
        }

        csvTestParams.csvDetails.start = start
        csvTestParams.csvDetails.end = end
        runTest(csvTestParams, 'dsOutputN', true, false)
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
        runTest(csvTestParams, 'dsOutputY', true, false)
    })
})