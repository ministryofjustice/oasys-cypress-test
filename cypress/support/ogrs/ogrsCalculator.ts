import { Decimal } from 'decimal.js'
import * as dayjs from 'dayjs'

import { snsvBCalc } from './snsvB'
import { snsvECalc } from './snsvE'
import { ogrs4GCalc } from './ogrs4G'
import { ogrs4VCalc } from './ogrs4V'
import { ogp2Calc } from './ogp2'
import { ovp2Calc } from './ovp2'
import { ospCCalc, ospICalc } from './osp'

const dateFormat = 'DD-MMM-YYYY'

export function calculateAssessment(inputs: AssessmentCalcInputs, toleranceParam: string, testCaseRef: string): AssessmentCalcResult {

    Decimal.set({ precision: 40 })

    const assessmentResult = {
        assessmentScores: [],
        logText: [],
        failed: false,
    }

    const today = dayjs()
    const dob = dayjs(inputs.dob, dateFormat)

    // TODO add offence category lookup from offence code
    const calculatedInputs: CalculatedInputs = {
        age: today.diff(dob, 'year'),
        ageAtFirstSanction: dayjs(inputs.dateOfFirstSanction, dateFormat).diff(dob, 'year'),
        ageAtLastSanction: dayjs(inputs.dateOfLastSanction, dateFormat).diff(dob, 'year'),
        ageAtLastSanctionSexual: dayjs(inputs.dateOfLastSanctionSexual, dateFormat).diff(dob, 'year'),
        yearsBetweenFirstTwoSanctions: (dayjs(inputs.dateOfLastSanction, dateFormat).diff(dayjs(inputs.dateOfFirstSanction), 'year')),
        ofm: today.diff(dayjs(inputs.communityDate, dateFormat), 'month'),
    }

    const tolerance = new Decimal(toleranceParam)

    assessmentResult.logText.push('')
    assessmentResult.logText.push(`Test case ${testCaseRef}`)
    assessmentResult.logText.push(`    Inputs: ${JSON.stringify(inputs)}`)
    assessmentResult.logText.push(`    Calculated inputs: ${JSON.stringify(calculatedInputs)}`)
    assessmentResult.logText.push('')

    compareAndAddLog('snsvB', inputs, calculatedInputs, snsvBCalc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('snsvE', inputs, calculatedInputs, snsvECalc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('ogrs4G', inputs, calculatedInputs, ogrs4GCalc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('ogrs4V', inputs, calculatedInputs, ogrs4VCalc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('ogp2', inputs, calculatedInputs, ogp2Calc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('ovp2', inputs, calculatedInputs, ovp2Calc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('ospC', inputs, calculatedInputs, ospCCalc(inputs, calculatedInputs, tolerance), assessmentResult)
    compareAndAddLog('ospI', inputs, calculatedInputs, ospICalc(inputs, calculatedInputs, tolerance), assessmentResult)


    assessmentResult.logText.push('')
    assessmentResult.logText.push(`    Total assessment calc time (ms): ${dayjs().diff(today)}`)

    return assessmentResult
}


function compareAndAddLog(scoreType: ScoreType, inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, actualResult: IndividualCalcResult, assessmentResult: AssessmentCalcResult) {

    const expectedResultYear1 = inputs.expectedResults[`${scoreType}Year1`]
    const expectedResultYear2 = inputs.expectedResults[`${scoreType}Year2`]

    assessmentResult.assessmentScores.push({ type: scoreType, resultYear1: actualResult.resultYear1, resultYear2: actualResult.resultYear2 })

    if (actualResult.pass) {
        assessmentResult.logText.push(`    ${scoreType} Year 1 expected: ${expectedResultYear1}, actual: ${actualResult.resultYear1}, difference: ${actualResult.diffYear1}`)
        assessmentResult.logText.push(`    ${scoreType} Year 2 expected: ${expectedResultYear2}, actual: ${actualResult.resultYear2}, difference: ${actualResult.diffYear2}`)

    } else {
        assessmentResult.logText.push('')
        assessmentResult.logText.push(`    FAIL: ${scoreType} Year 1 expected: ${expectedResultYear1}, actual: ${actualResult.resultYear1}, difference: ${actualResult.diffYear1}`)
        assessmentResult.logText.push(`    FAIL: ${scoreType} Year 2 expected: ${expectedResultYear2}, actual: ${actualResult.resultYear2}, difference: ${actualResult.diffYear2}`)

        assessmentResult.logText.push('')
        actualResult.logText.forEach((log) => {
            assessmentResult.logText.push(`        ${log}`)
        })
        assessmentResult.logText.push('')
        assessmentResult.failed = true
    }
}

export function addAndReportPolynomial4(description: string, input: number, coef1: Decimal, coef2: Decimal, coef3: Decimal, coef4: Decimal, runningTotal: Decimal, logText: string[]): Decimal {

    let result = new Decimal(0)
    const param = new Decimal(input)

    result = result.add(param.times(coef1))
    result = result.add(param.pow(2).times(coef2))
    result = result.add(param.pow(3).times(coef3))
    result = result.add(param.pow(4).times(coef4))

    return addAndReport(description, result, runningTotal, logText)
}

export function addAndReportPolynomial2(description: string, input: number, coef1: Decimal, coef2: Decimal, runningTotal: Decimal, logText: string[]): Decimal {

    let result = new Decimal(0)
    const param = new Decimal(input)

    result = result.add(param.times(coef1))
    result = result.add(param.pow(2).times(coef2))

    return addAndReport(description, result, runningTotal, logText)
}

export function addAndReportCopas(type: 'general' | 'vGeneral' | 'violent' | 'generalSquared',
    inputs: AssessmentCalcInputs, calculatedInputs: CalculatedInputs, coef: Decimal, runningTotal: Decimal, logText: string[]): Decimal {

    const boost = type == 'vGeneral' ? 12 : type == 'violent' ? 30 : 26
    const count = type == 'violent' ? inputs.violenceSanctionCount : inputs.sanctionCount

    let result = new Decimal(count).div(boost + calculatedInputs.ageAtLastSanction - calculatedInputs.ageAtFirstSanction)
    result = result.ln()
    if (type == 'generalSquared') {
        result = result.pow(2)
    }
    result = result.times(coef)

    return addAndReport(`Copas ${type}`, result, runningTotal, logText)
}

export function addAndReport(description: string, value: Decimal, runningTotal: Decimal, logText: string[]): Decimal {

    logText.push(`${description}: ${value}`)
    return runningTotal.add(value)
}