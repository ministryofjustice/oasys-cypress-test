import * as fs from 'fs-extra'

import { calculateAssessment } from './ogrsCalculator'

const dataFilePath = './cypress/support/ogrs/data/'
const headers = true
let assessmentData: string[]

export async function ogrsTest(parameters: OgrsTestParameters): Promise<OgrsTestResult> {

    const dataSet = await fs.readFile(`${dataFilePath}${parameters.dataFile}.csv`, 'utf8')
    const assessments = dataSet.split('\r\n')
    const results: AssessmentCalcResult[] = []

    let failed = false
    
    for (let i = headers ? 1 : 0; i < assessments.length; i++) {
        const assessmentResult = calculateAssessment(extractParameters(assessments[i]), parameters.tolerance, i.toString())
        results.push(assessmentResult)
        if (assessmentResult.failed) {
            failed = true
        }
    }

    return { assessmentResults: results, failed: failed }
}

function extractParameters(assessment: string): AssessmentCalcInputs {

    assessmentData = assessment.split(',')

    return {

        dob: getStringParameter('dob'),
        dateOfLastSanction: getStringParameter('dateOfLastSanction'),
        dateOfFirstSanction: getStringParameter('dateOfFirstSanction'),
        communityDate: getStringParameter('communityDate'),
        dateOfLastSanctionSexual: getStringParameter('dateOfLastSanctionSexual'),
        gender: getStringParameter('gender') as Gender,
        offence: getStringParameter('offence') as OgrsOffence,
        sanctionCount: getNumericParameter('sanctionCount'),
        violenceSanctionCount: getNumericParameter('violenceSanctionCount'),
        // sexual offences
        contactAdultCount: getNumericParameter('contactAdultCount'),
        contactChildCount: getNumericParameter('contactChildCount'),
        nonContactCount: getNumericParameter('nonContactCount'),
        contactWithStranger: getStringParameter('contactWithStranger') as OgrsYN,
        everCommittedSexualOffence: getStringParameter('everCommittedSexualOffence') as OgrsYN,
        childImageCount: getNumericParameter('childImageCount'),
        // criminogenic needs
        twoPointTwoA: getNumericParameter('twoPointTwoA'),
        threePointFour: getNumericParameter('threePointFour'),
        fourPointTwo: getNumericParameter('fourPointTwo'),
        sixPointFour: getNumericParameter('sixPointFour'),
        sixPointSeven: getNumericParameter('sixPointSeven'),
        sixPointEight: getNumericParameter('sixPointEight'),
        sevenPointTwo: getNumericParameter('sevenPointTwo'),
        eightPointEight: getNumericParameter('eightPointEight'),
        ninePointOne: getNumericParameter('ninePointOne'),
        ninePointTwo: getNumericParameter('ninePointTwo'),
        elevenPointTwo: getNumericParameter('elevenPointTwo'),
        elevenPointFour: getNumericParameter('elevenPointFour'),
        twelvePointOne: getNumericParameter('twelvePointOne'),
        // previous convictions
        previousHomicide: getNumericParameter('previousHomicide'),
        previousWoundingGBH: getNumericParameter('previousWoundingGBH'),
        previousKidnapping: getNumericParameter('previousKidnapping'),
        previousFirearms: getNumericParameter('previousFirearms'),
        previousRobbery: getNumericParameter('previousRobbery'),
        previousAggBurglary: getNumericParameter('previousAggBurglary'),
        previousWeaponsNotFirearms: getNumericParameter('previousWeaponsNotFirearms'),
        previousCrimDamageEndangeringLife: getNumericParameter('previousCrimDamageEndangeringLife'),
        previousArson: getNumericParameter('previousArson'),
        // drugs
        dailyDrugsUse: getStringParameter('dailyDrugsUse') as OgrsYN,
        heroin: getStringParameter('heroin') as OgrsYN,
        methadone: getStringParameter('methadone') as OgrsYN,
        otherOpiate: getStringParameter('otherOpiate') as OgrsYN,
        crack: getStringParameter('crack') as OgrsYN,
        cocaine: getStringParameter('cocaine') as OgrsYN,
        prescribed: getStringParameter('prescribed') as OgrsYN,
        benzodiazipines: getStringParameter('benzodiazipines') as OgrsYN,
        amphetamines: getStringParameter('amphetamines') as OgrsYN,
        ecstasy: getStringParameter('ecstasy') as OgrsYN,
        cannabis: getStringParameter('cannabis') as OgrsYN,
        steroid: getStringParameter('steroid') as OgrsYN,
        other: getStringParameter('other') as OgrsYN,
        // Oracle results
        expectedResults: {
            snsvBYear1: getStringParameter('snsvBYear1'),
            snsvBYear2: getStringParameter('snsvBYear2'),
            snsvEYear1: getStringParameter('snsvEYear1'),
            snsvEYear2: getStringParameter('snsvEYear2'),
            ogrs4GYear1: getStringParameter('ogrs4GYear1'),
            ogrs4GYear2: getStringParameter('ogrs4GYear2'),
            ogrs4VYear1: getStringParameter('ogrs4VYear1'),
            ogrs4VYear2: getStringParameter('ogrs4VYear2'),
            ogp2Year1: getStringParameter('ogp2Year1'),
            ogp2Year2: getStringParameter('ogp2Year2'),
            ovp2Year1: getStringParameter('ovp2Year1'),
            ovp2Year2: getStringParameter('ovp2Year2'),
            ospCYear1: getStringParameter('ospCYear1'),
            ospCYear2: getStringParameter('ospCYear2'),
            ospIYear1: getStringParameter('ospIYear1'),
            ospIYear2: getStringParameter('ospIYear2'),
        },
    }

}

function getNumericParameter(parameter: string): number {

    return Number.parseInt(assessmentData[parameterLookup.indexOf(parameter)])
}

function getStringParameter(parameter: string): string {

    return assessmentData[parameterLookup.indexOf(parameter)]
}

const parameterLookup = [
    'dob',
    'dateOfLastSanction',
    'dateOfFirstSanction',
    'communityDate',
    'dateOfLastSanctionSexual',
    'gender',
    'offence',
    'sanctionCount',
    'violenceSanctionCount',
    'contactAdultCount',
    'contactChildCount',
    'nonContactCount',
    'contactWithStranger',
    'everCommittedSexualOffence',
    'childImageCount',
    'twoPointTwoA',
    'threePointFour',
    'fourPointTwo',
    'sixPointFour',
    'sixPointSeven',
    'sixPointEight',
    'sevenPointTwo',
    'eightPointEight',
    'ninePointOne',
    'ninePointTwo',
    'elevenPointTwo',
    'elevenPointFour',
    'twelvePointOne',
    'previousHomicide',
    'previousWoundingGBH',
    'previousKidnapping',
    'previousFirearms',
    'previousRobbery',
    'previousAggBurglary',
    'previousWeaponsNotFirearms',
    'previousCrimDamageEndangeringLife',
    'previousArson',
    'dailyDrugsUse',
    'heroin',
    'methadone',
    'otherOpiate',
    'crack',
    'cocaine',
    'prescribed',
    'benzodiazipines',
    'amphetamines',
    'ecstasy',
    'cannabis',
    'steroid',
    'other',
    'snsvBYear1',
    'snsvBYear2',
    'snsvEYear1',
    'snsvEYear2',
    'ogrs4GYear1',
    'ogrs4GYear2',
    'ogrs4VYear1',
    'ogrs4VYear2',
    'ogp2Year1',
    'ogp2Year2',
    'ovp2Year1',
    'ovp2Year2',
    'ospCYear1',
    'ospCYear2',
    'ospIYear1',
    'ospIYear2',
]