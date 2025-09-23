declare type Gender = 'M' | 'F'
declare type OgrsYN = 'Y' | 'N'

declare type OgrsOffence =
    'Absconding/bail' |
    'Burglary (domestic)' |
    'Burglary (other)' |
    'Criminal damage' |
    'Drink driving' |
    'Drug import/export/production' |
    'Drug possession/supply' |
    'Drunkenness' |
    'Fraud and forgery' |
    'Handling stolen goods' |
    'Motoring offences' |
    'Other offences' |
    'Public order and harassment' |
    'Acquisitive violence' |
    'Sexual (against child)' |
    'Sexual (not against child)' |
    'Theft (non-motor)' |
    'Violence against the person' |
    'Violence against the person' |
    'Violence against the person' |
    'Violence against the person' |
    'Violence against the person' |
    'Vehicle-related theft' |
    'Welfare fraud'

declare type OgrsTestParameters = { dataFile: string, tolerance: string }

declare type AssessmentCalcInputs = {
    dob: string,
    dateOfLastSanction: string,
    dateOfFirstSanction: string,
    communityDate: string,
    dateOfLastSanctionSexual: string,
    gender: Gender,
    offence: OgrsOffence,
    sanctionCount: number,
    violenceSanctionCount: number,
    // sexual offences
    contactAdultCount: number
    contactChildCount: number
    nonContactCount: number
    contactWithStranger: OgrsYN
    everCommittedSexualOffence: OgrsYN
    childImageCount: number
    // criminogenic needs
    twoPointTwoA: number,
    threePointFour: number,
    fourPointTwo: number,
    sixPointFour: number,
    sixPointSeven: number,
    sixPointEight: number,
    sevenPointTwo: number,
    eightPointEight: number,
    ninePointOne: number,
    ninePointTwo: number,
    elevenPointTwo: number,
    elevenPointFour: number,
    twelvePointOne: number,
    // previous convictions
    previousHomicide: number,
    previousWoundingGBH: number,
    previousKidnapping: number,
    previousFirearms: number,
    previousRobbery: number,
    previousAggBurglary: number,
    previousWeaponsNotFirearms: number,
    previousCrimDamageEndangeringLife: number,
    previousArson: number,
    // drugs
    dailyDrugsUse: OgrsYN,
    heroin: OgrsYN,
    methadone: OgrsYN,
    otherOpiate: OgrsYN,
    crack: OgrsYN,
    cocaine: OgrsYN,
    prescribed: OgrsYN,
    benzodiazipines: OgrsYN,
    amphetamines: OgrsYN,
    ecstasy: OgrsYN,
    cannabis: OgrsYN,
    steroid: OgrsYN,
    other: OgrsYN,
    // Oracle results
    expectedResults: {
        snsvBYear1: string,
        snsvBYear2: string,
        snsvEYear1: string,
        snsvEYear2: string,
        ogrs4GYear1: string,
        ogrs4GYear2: string,
        ogrs4VYear1: string,
        ogrs4VYear2: string,
        ogp2Year1: string,
        ogp2Year2: string,
        ovp2Year1: string,
        ovp2Year2: string,
        ospCYear1: string,
        ospCYear2: string,
        ospIYear1: string,
        ospIYear2: string,
    }
}

declare type CalculatedInputs = {
    age: number,
    ageAtFirstSanction: number,
    ageAtLastSanction: number,
    ageAtLastSanctionSexual: number
    yearsBetweenFirstTwoSanctions: number,
    ofm: number,
}

declare type ScoreType = 'snsvB' | 'snsvE' | 'ogrs4G' | 'ogrs4V' | 'ogp2' | 'ovp2' | 'ospC' | 'ospI'

declare type IndividualCalcResult = {
    resultYear1: string,
    resultYear2: string,
    diffYear1: string,
    diffYear2: string,
    pass: boolean,
    logText: string[]
}

declare type AssessmentCalcResult = {
    assessmentScores: { type: ScoreType, resultYear1: string, resultYear2: string }[],
    logText: string[],
    failed: boolean,
}

declare type OgrsTestResult = {
    assessmentResults: AssessmentCalcResult[],
    failed: boolean,
}
