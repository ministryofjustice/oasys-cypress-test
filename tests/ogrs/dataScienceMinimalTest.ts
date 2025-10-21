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
            reportMode: 'normal',
        }

        csvTestParams.csvDetails.start = 11
        csvTestParams.csvDetails.end = 11
        runTest(csvTestParams, null, false, false)
    })

})