import { OgrsTestParameters } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

describe('OGRS calculator test - data science test cases', () => {

    it('Data science test cases - static N, part 1', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'N',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.end = 4999
        runTest(csvTestParams, 'dsOutputN1', true, true)
    })

    it('Data science test cases - static N, part 2', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'N',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.start = 5000
        runTest(csvTestParams, 'dsOutputN2', true, true)
    })

    it('Data science test cases - static Y, part 1', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'Y',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.end = 4999
        runTest(csvTestParams, 'dsOutputY1', true, true)
    })

    it('Data science test cases - static Y, part 2', () => {

        const csvTestParams: OgrsTestParameters = {
            testType: 'csv',
            csvDetails: {
                dataFile: 'dsTestCases',
            },
            staticFlag: 'Y',
            reportMode: 'minimal',
        }

        csvTestParams.csvDetails.start = 5000
        runTest(csvTestParams, 'dsOutputY2', true, true)
    })

})