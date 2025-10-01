import * as fs from 'fs-extra'

import { OgrsTestParameters, OgrsTestScriptResult, TestCaseResult } from './types'
import { calculateAssessment } from './ogrsCalculator'
import { loadParameterSet, loadExpectedValues } from './loadTestData'

const dataFilePath = './cypress/support/ogrs/data/'
const headers = true
export const dateFormat = 'DD-MMM-YYYY'

export async function ogrsTest(parameters: OgrsTestParameters): Promise<OgrsTestScriptResult> {

    const dataSet = await fs.readFile(`${dataFilePath}${parameters.dataFile}.csv`, 'utf8')
    const assessments = dataSet.split('\r\n')
    const expectedResultsSet = await fs.readFile(`${dataFilePath}${parameters.resultsFile}.csv`, 'utf8')
    const expectedResults = expectedResultsSet.split('\r\n')

    const results: TestCaseResult[] = []

    let failed = false

    for (let i = headers ? 1 : 0; i < assessments.length; i++) {
        const assessmentResult = calculateAssessment(loadParameterSet(assessments[i]), loadExpectedValues(expectedResults[i]), parameters.tolerance, i.toString())
        results.push(assessmentResult)
        if (assessmentResult.failed) {
            failed = true
        }
    }

    return { assessmentResults: results, failed: failed }
}

