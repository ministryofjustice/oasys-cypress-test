declare type DbResponse = { data: number | string | string[] | string[][], error: string }

declare type SnsMessageType = 'AssSumm' | 'OGRS' | 'OPD' | 'RSR'
declare type AssessmentOrRsr = 'assessment' | 'rsr'

declare type EndpointStat = { endpoint: Endpoint | 'database', responseTimes: number[] }

declare type EndpointParams = {
    endpoint: Endpoint,
    crnSource?: Provider
    crn?: string,
    laoPrivilege: 'ALLOW' | 'LIMIT' | 'rubbish',
    assessmentPk?: number,
    expectedStatus?: string
}

declare type EndpointUrl = { endpoint: Endpoint, url: string }

declare type Endpoint =
    'token' |
    'offences' |
    'riskScores' |
    'allRiskScores' |
    'rmp' |
    'timeline' |
    'apAsslist' |
    'apOffence' |
    'apNeeds' |
    'apRmp' |
    'apRoshSum' |
    'apRiskInd' |
    'apRiskAss' |
    'apHealth' |
    'apRosh' |
    'assSumm' |
    'assSummSan' |
    'v4AssList' |
    'v4section1' |
    'v4section2' |
    'v4section3' |
    'v4section4' |
    'v4section5' |
    'v4section6' |
    'v4section7' |
    'v4section8' |
    'v4section9' |
    'v4section10' |
    'v4section11' |
    'v4section12' |
    'v4section13' |
    'v4Rmp' |
    'v4RoshFull' |
    'v4RoshSumm' |
    'v4Victim' |
    'v4RiskIndividual' |
    'v4RiskScoresAss' |
    'v4RiskScoresRsr'

declare type CheckAPIResult = {
    failed: boolean,
    output: string[]
}

declare type RestResponse = {
    url: string,
    statusCode: RestStatus,
    result: object,
    message: string,
    responseTime: number,
}

declare type RestStatus = 'error' | 'ok' | 'badRequest' | 'forbidden' | 'notFound' | 'conflict'
declare type RestErrorResult = { statusCode: RestStatus, message: string }
declare type RestErrorResults = {
    ok: RestErrorResult,
    noOffender: RestErrorResult,
    noMatchingAssessments: RestErrorResult,
    duplicateCRN: RestErrorResult,
    noAssessments: RestErrorResult,
    badParameters: RestErrorResult,
    forbidden: RestErrorResult,
}

declare type OasysAnswer = { section: string, q: string, a: string }
declare type AnswerType = 'refAnswer' | 'freeFormat' | 'additionalNote' | 'multipleRefAnswer'
declare type Victim = { age: string, gender: string, ethnicCat: string, relationship: string }