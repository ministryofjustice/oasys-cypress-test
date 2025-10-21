import { OgrsTestParameters } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

describe('OGRS calculator test - data science test cases', () => {

    it('Data science test cases - part 1', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'N',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.end = 4999
        runTest(csvTestParams, 'dsOutput1', true, true)
    })

    it('Data science test cases - part 2', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'N',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.start = 5000
        runTest(csvTestParams, 'dsOutput2', true, true)
    })

})