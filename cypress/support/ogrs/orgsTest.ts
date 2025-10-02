import * as fs from 'fs-extra'

import { OgrsTestParameters, OgrsTestScriptResult, TestCaseResult } from './types'
import { calculateTestCase } from './ogrsCalculator'
import { loadParameterSet, loadExpectedValues } from './loadTestData'

const dataFilePath = './cypress/support/ogrs/data/'
export let dateFormat = ''

export async function ogrsTest(testParams: OgrsTestParameters): Promise<OgrsTestScriptResult> {

    dateFormat = testParams.dateFormat

    const inputParameterFile = await fs.readFile(`${dataFilePath}${testParams.dataFile}.csv`, 'utf8')
    const expectedResultsFile = await fs.readFile(`${dataFilePath}${testParams.resultsFile}.csv`, 'utf8')

    const inputParameters = inputParameterFile.split('\r\n')
    const expectedResults = expectedResultsFile.split('\r\n')

    const ogrsTestResults: TestCaseResult[] = []
    let failed = false

    for (let i = testParams.headers ? 1 : 0; i < inputParameters.length; i++) {

        const testCaseParams = loadParameterSet(inputParameters[i])
        const expectedTestCaseResult = loadExpectedValues(expectedResults[i])
        const testCaseIdentifier = i.toString()

        const testCaseResult = calculateTestCase(testCaseParams, expectedTestCaseResult, testCaseIdentifier, testParams)
        ogrsTestResults.push(testCaseResult)
        if (testCaseResult.failed) {
            failed = true
        }
    }

    return { testCaseResults: ogrsTestResults, failed: failed }
}

