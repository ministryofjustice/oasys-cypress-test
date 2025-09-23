/**
 * __oasys.Api.*function*__  
 * 
### Rest API testing

The `oasys\tests\regression\restAPI` folder contains two tests which aim to carry out a comprehensive regression test on all endpoints.

#### `oasys\tests\regression\restAPI\endpointErrors.cy.ts`

This test calls each endpoint with parameters designed to generate an error condition, including:
  - duplicate CRN
  - invalid CRN
  - invalid LAO parameter
  - access denied due to LAO status
  - no assessment found

#### `oasys\tests\regression\restAPI\testAllApisMultipleOffenders.cy.ts`

This runs a regression test for all endpoints for a sample of offenders extracted from the database.  Offenders are selected on a partially random basis - 
there are 10 groups of offenders, each created prior to a random date in each of the last 10 years.  There is also another set of specific offenders that are known to have certain
data to ensure good test coverage.

For each selected offender, and each assessment for that offender, all necessary data is extracted from the database and used to build an expected response for each endpoint.
These expected responses are then compared against the actual responses, to identify missing properties, extra properties and incorrect values.

### Adding new APIs

The following steps are required to add any new endpoints to the API tests:

  - if any new data from the OASys database is required, update or add the appropriate class in `oasys\restAPI\dbClasses.ts`.  Each class here contains the relevant SQL query
    as well as a constructor to create an object using the data returned by that query.  If new classes/queries are added, you will also have to update the code in
    `cypress\support\restAPIdb.ts` that runs the queries.
  - add the new endpoint (assigning an appropriate name) to the `Endpoint` enum in `oasys\restAPI\callAPI.ts`.
  - use that name to add the url to the `restAPIUrls` const in `cypress\support\environments.ts`.
  - create a new class to define the expected endpoint response (details below).
  - add the new endpoint to the list of function calls in `getSingleResponse` in `oasys\restAPI\getExpectedResponses.ts`.
  - add the new endpoint to the appropriate list in `oasys\restAPI\testOneOffender.ts`.
  - add the new endpoint to the appropriate list in `oasys\tests\regression\restAPI\endpointErrors.cy.ts`.

#### Endpoint classes

Expected responses are constructed using Typescript classes to define all the properties; there is a class for each endpoint in one of the folders under `oasys\restAPI`.
Common values (such as the assessment timeline and common assessment details) are added by the base classes, e.g. `oasys\restAPI\v4\v4Common.ts` which in turn inherits from 
`oasys\restAPI\common.ts`.

Each class file must be referenced in the `index.ts` file in the same folder, and must contain the items described below.  In general the best approach is to copy an existing class
file and modify it to fit the new specification; most new endpoints will be similar others in the `oasys\restAPI\v4` folder so one of these is likely to be a good starting point.

#### `function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: api.EndpointParams, resultAlias: string)`

This function is called from `oasys\restAPI\getExpectedResponses.ts`, and returns the expected endpoint response using a Cypress alias. The required parameters are:
  - a `DbOffenderWithAssessments` object, this will contain all necessary offender and assessment data
  - the endpoint parameters (e.g. endpoint name, CRN, assessment PK etc)

It identifies the relevant assessment details, then creates a response object using classes like these examples:

#### `class RoshSummEndpointResponse extends v4Common.V4EndpointResponse`
#### `RoshSummAssessment extends v4Common.V4AssessmentCommon`

These, together with any other classes appropriate to each endpoint, contain property names that match the expected JSON property names, and are populated with the supplied 
offender and assessment data.
 * 
 * @module API
 */

import * as rest from 'restApi'
import * as dbClasses from 'restApi/dbClasses'
import { flatten } from 'flat'                      // https://www.npmjs.com/package/flat


/** 
 * Tests all endpoints for all assessments for given offender probation CRN; uses a result alias to return a true/false result (true if any tests fail).
 * All necessary data is pulled from the database to build expected responses.
 * 
 * Parameters:
 *  - crn (either probation or prison CRN as specified by the next parameter)
 *  - crnSource - 'prob' or 'pris'
 *  - resultAlias - a Cypress alias name used to return the result
 *  - skipPkOnlyCalls - if true, any APIs that are called with just an assessment PK will be skipped on the basis that the calling script is repeating an offender 
 *                      (selected this time using the prison CRN instead of probation) so these calls will be identical.
 *  - stats - optional array of EndpointStat objects to collect timing stats
 */
export function testOneOffender(crn: string, crnSource: Provider, resultAlias: string, skipPkOnlyCalls: boolean, stats: EndpointStat[] = null) {

    let failed = false

    const v1Endpoints: Endpoint[] = [
        'offences',
        'riskScores',
        'allRiskScores',
        'rmp',
    ]
    const apEndpoints: Endpoint[] = [
        'apOffence',
        'apNeeds',
        'apRmp',
        'apRoshSum',
        'apRiskInd',
        'apRiskAss',
        'apHealth',
        'apRosh',
    ]

    const v4AssessmentEndpoints: Endpoint[] = [
        'v4section1',
        'v4section2',
        'v4section3',
        'v4section4',
        'v4section5',
        'v4section6',
        'v4section7',
        'v4section8',
        'v4section9',
        'v4section10',
        'v4section11',
        'v4section12',
        'v4section13',
        'v4Rmp',
        'v4RoshFull',
        'v4RoshSumm',
        'v4Victim',
        'v4RiskIndividual',
        'v4RiskScoresAss',
    ]

    const v4RsrEndpoints: Endpoint[] = [
        'v4RiskScoresRsr',
    ]

    // Get all relevant data from the OASys database
    rest.GetExpectedResponses.getOffenderWithAssessments(crnSource, crn, 'offenderData')
    cy.get<dbClasses.DbOffenderWithAssessments>('@offenderData').then((offenderData) => {

        if (offenderData == null) {  // null return indicates no offender data or multiple offenders with the same CRN.  Tests for these cases are covered elsewhere in the regression pack
            cy.groupedLogStart(`Offender ${crnSource == 'prob' ? 'CRN' : 'NOMIS Id'}: ${crn}`)
            cy.groupedLog('Skipping this offender - no offender data or multiple offender records with the same CRN')
            cy.groupedLog('')
            cy.groupedLogEnd()

        } else {
            // Store the elapsed time for database querying
            if (stats != null) {
                stats.filter((stat) => stat.endpoint == 'database')[0].responseTimes.push(offenderData.dbElapsedTime)
            }
            cy.groupedLogStart(`Offender ${crnSource == 'prob' ? 'CRN' : 'NOMIS Id'}: ${crnSource == 'prob' ? offenderData.probationCrn : offenderData.nomisId}`)
            cy.groupedLog('')
            const parameters: EndpointParams[] = []

            if (crnSource == 'prob') { // Ignore 'pris' offenders for versions 1 to 3 endpoints

                // Add parameters for the V1 endpoints
                v1Endpoints.forEach((endpoint) => {
                    const params: EndpointParams = { endpoint: endpoint, crn: offenderData.probationCrn, laoPrivilege: 'ALLOW' }
                    parameters.push(params)
                })

                // Add AP Initial
                const params: EndpointParams = { endpoint: 'apAsslist', crn: offenderData.probationCrn, laoPrivilege: 'ALLOW' }
                parameters.push(params)

                // Add other AP endpoint params if the offender has assessments
                const apAssessments = offenderData.assessments.filter(rest.Ap.ApCommon.assessmentFilter)
                const assCount = apAssessments.length
                if (assCount > 0) {
                    apAssessments.forEach((assessment) => addAssessment(apEndpoints, parameters, offenderData.probationCrn, assessment))
                }

                // Use latest complete or locked incomplete assessment for the AssSumm - only if initiated after 1st Jan 2018 to avoid incompatible data.  In reality should only be used from release 6.46
                const assSummAssessments = offenderData.assessments.filter((ass) =>
                    !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)
                    && ['COMPLETE', 'LOCKED_INCOMPLETE'].includes(ass.status)
                    && ass.initiationDate > '2020')
                if (assSummAssessments.length > 0) {
                    const assessment = assSummAssessments[assSummAssessments.length - 1]
                    parameters.push({
                        endpoint: assessment['sanIndicator'] == 'Y' ? 'assSummSan' : 'assSumm', crn: offenderData.probationCrn, laoPrivilege: 'ALLOW',
                        assessmentPk: assessment.assessmentPk, expectedStatus: assessment.status
                    })
                }
            }

            // Add V4 asslist
            const v4Asslistparams: EndpointParams = {
                endpoint: 'v4AssList',
                crnSource: crnSource,
                crn: crnSource == 'prob' ? offenderData.probationCrn : offenderData.nomisId,
                laoPrivilege: 'ALLOW'
            }
            parameters.push(v4Asslistparams)

            // Add other V4 endpoint params if the offender has assessments and if skipPkOnlyCalls parameter is false
            if (!skipPkOnlyCalls) {
                // V4 timeline includes layer2 but the subsequents do not
                const relevantAssessments = offenderData.assessments.filter(rest.V4Common.assessmentFilter).filter((ass) => ass.assessmentType != 'LAYER2')
                if (relevantAssessments.length > 0) {
                    relevantAssessments.forEach((assessment) => addAssessment(v4AssessmentEndpoints, parameters, offenderData.probationCrn, assessment))
                }

                // Add RSRs
                const standaloneRsrs = offenderData.assessments.filter((ass) => ass.assessmentType == 'STANDALONE')
                if (standaloneRsrs.length > 0) {
                    standaloneRsrs.forEach((assessment) => addAssessment(v4RsrEndpoints, parameters, offenderData.probationCrn, assessment))
                }
            }

            // Work out the expected responses, then call the endpoints
            rest.GetExpectedResponses.getExpectedResponses(offenderData, parameters, 'expectedValuesAlias')
            cy.get<(rest.Common.EndpointResponse | RestErrorResult)[]>('@expectedValuesAlias').then((expectedValues) => {

                getAPIResponses(parameters, 'actualValuesAlias')
                cy.get<RestResponse[]>('@actualValuesAlias').then((actualValues) => {

                    // Compare results for each endpoint
                    for (let i = 0; i < parameters.length; i++) {
                        if (parameters[i].endpoint == 'apAsslist' || parameters[i].endpoint == 'v4AssList') {
                            delete actualValues[i].result['assessments']  // spurious empty array object gets added to the asslist and allasslist endpoints, ignore for this test
                        }
                        if (parameters[i].assessmentPk) {  // Write some assessment details to the log, including OASys version at initiation date
                            const assessmentData = offenderData.assessments.filter((ass) => ass.assessmentPk == parameters[i].assessmentPk)[0]
                            const assVersion = assessmentData.assessmentType == 'STANDALONE' ? '' : ` v${(assessmentData as dbClasses.DbAssessment).assessmentVersion}`
                            cy.groupedLog(`${assessmentData.assessmentType}${assVersion} assessment (${assessmentData.assessmentPk}), initiation date ${assessmentData.initiationDate.substring(0, 10)} (${assessmentData.appVersion})`)
                        }

                        // Compare expected vs actuals and write results to the log
                        const result = checkAPIResponse(expectedValues[i], actualValues[i], 'strict')

                        // Check response time and add to stats table, mark as SLOW if > 99ms
                        let slow = actualValues[i].responseTime > 500 ? '**** VERY SLOW ****' : actualValues[i].responseTime > 99 ? '**** SLOW ****' : ''
                        cy.groupedLog(`${actualValues[i].responseTime}ms ${slow}`)
                        if (stats != null) {
                            stats.filter((stat) => stat.endpoint == parameters[i].endpoint)[0].responseTimes.push(actualValues[i].responseTime)
                        }
                        if (result.failed) {
                            //                            failed = true

                            // Ignore defect that is low priority and not yet fixed - old assessments not found for AP endpoints when CRN contains lower-case letters
                            if (offenderData.probationCrn.toUpperCase() != offenderData.probationCrn
                                && ['apOffence', 'apNeeds', 'apRmp', 'apRoshSum', 'apRiskInd', 'apRiskAss', 'apHealth', 'apRosh',].includes(parameters[i].endpoint)
                                && result.output.filter((line) => line.includes('got notFound, No matching assessments')).length > 0
                                && result.output.length == 6) {
                                result.output.slice(0, 3).forEach((line) => cy.groupedLog(line))
                                cy.groupedLog('************************************************************')
                                cy.groupedLog('Defect NOD-872 - assessment not returned for lower-case CRNs')
                                cy.groupedLog('')
                            }
                            else {
                                failed = true
                                result.output.forEach((line) => cy.groupedLog(line))
                            }
                        } else {
                            result.output.forEach((line) => cy.groupedLog(line))
                        }
                    }
                })
            })
            cy.groupedLogEnd()
        }

    }).then(() => {
        cy.wrap(failed).as(resultAlias)
    })

}

function addAssessment(endpoints: Endpoint[], parameters: EndpointParams[], crn: string, assessment: dbClasses.DbAssessmentOrRsr) {

    endpoints.forEach((endpoint) => {
        const params: EndpointParams = {
            endpoint: endpoint, crn: crn,
            laoPrivilege: 'ALLOW', assessmentPk: assessment.assessmentPk, expectedStatus: assessment.status
        }
        parameters.push(params)
    })
}

/**
 * Call any number of APIs and return the results as a RestResponse array which is accessed using the supplied alias.
 * 
 *  Parameters are:
 *      1) an EndpointParams array including the endpoint and associated parameters such as CRN for each endpoint
 *      2) an ouptut alias to return results.
 */
export function getAPIResponses(parameters: EndpointParams[], resultAlias: string) {

    cy.task('ç', parameters).then((response: RestResponse[]) => {
        cy.wrap(response).as(resultAlias)
    })
}

/**
 * Call a single API and return the results as a RestResponse object which is accessed using the supplied alias.
 * 
 *  Parameters are:
 *      1) an EndpointParams object including the endpoint and associated parameters such as CRN
 *      2) an ouptut alias to return results.
 */
export function getAPIResponse(parameters: EndpointParams, resultAlias: string) {

    cy.task('getRestData', parameters).then((response: RestResponse) => {
        cy.wrap(response).as(resultAlias)
    })
}

/**
 * Calls an endpoint and checks the error conditions where a status code other than OK is expected, along with an error message.
 * Parameters are:
 *      1) an EndpointParams object including the endpoint and associated parameters such as CRN
 *      2) a RestErrorResult object defining the expected result, standard responses are defined in the RestErrorResult class in this module.
 *      3) an optional ouptut alias to return results.
 * 
 * If the last parameter is included, the test will not fail.  The output that can be accessed via the supplied alias
 * is a boolean, set to true if the check failed. 
 */
export function checkAPIError(parameters: EndpointParams, expectedResult: RestErrorResult, resultAlias: string = '') {

    cy.task('getRestData', parameters).then((response: RestResponse) => {

        let failed = false
        cy.groupedLogStart(`Checking RestAPI response for: ${response.url}, expecting ${expectedResult.statusCode}`)
        cy.groupedLog(`result: ${JSON.stringify(response.result)}`)

        if (response.statusCode != expectedResult.statusCode) {
            cy.groupedLog(`Error checking API ${response.url}: expected status ${expectedResult.statusCode}, got ${response.statusCode}`)
            failed = true
        }

        if (response.message != expectedResult.message) {
            cy.groupedLog(`Error checking API ${response.url}: expected '${expectedResult.message}', got '${response.message}'`)
            failed = true
        }
        cy.groupedLogEnd().then(() => {
            if (resultAlias == '') {
                if (failed) {
                    throw new Error('Failed checking RestAPI response')
                }
            } else {
                cy.wrap(failed).as(resultAlias)
            }
        })
    })
}

/**
 * Checks an endpoint response value against the expected return values.
 * Parameters are:
 * 
 *      1) an object containing the expected values, in the expected structure.
 *      2) an object containing the actual response values.
 *      3) mode, one of the following string values:
 *              'strict': the test will fail if the response data includes items that are not in the expected data
 *              'subset': extra items are ignored
 *              'ignoreDates': same as strict, but anything that has the word 'date' in the name (not case-sensitive) in the expected values will be ignored
 * 
 * Returns a CheckAPIResult object with two properties: failed (boolean) and output (string[] with the log details). 
 */
export function checkAPIResponse(expectedValues: rest.Common.EndpointResponse | RestErrorResult, response: RestResponse, mode: 'strict' | 'subset' | 'ignoreDates'): CheckAPIResult {

    let failed = false
    let logText: string[] = []

    if (mode == 'strict') logText.push(`Checking ${response.url}`)
    else logText.push(`Checking ${response.url} in '${mode}' mode`)
    logText.push(`    expect: ${JSON.stringify(expectedValues)}`)

    // If an error is expected, check the error message
    if (expectedValues['statusCode'] != undefined) {
        logText.push(`    response: ${JSON.stringify(response)}`)
        const expectedResult = expectedValues as RestErrorResult

        if (response.statusCode == 'ok') {
            logText.push(`Error checking API ${response.url}: expected ${expectedResult.statusCode}, got ${response.statusCode}`)
            failed = true
        } else {
            if (response.statusCode != expectedResult.statusCode) {
                logText.push(`Error checking API ${response.url}: expected status ${expectedResult.statusCode}, got ${response.statusCode}`)
                failed = true
            }

            if (response.message != expectedResult.message) {
                logText.push(`Error checking API ${response.url}: expected '${expectedResult.message}', got '${response.message}'`)
                failed = true
            }
        }

        // Fail if an error is returned but was not expected
    } else if (response.statusCode != 'ok') {

        logText.push(`Error checking API ${response.url}: got ${response.statusCode}, ${response.message}`)
        failed = true

        // otherwise check the contents of the response
    } else {
        let data = JSON.stringify(response.result)
        if (data.charCodeAt(0) == 34) {
            data = data.substring(1, data.length - 1)
        }
        try {
            response.result = JSON.parse(data)
        } catch (e) {
            logText.push(`************ FAILED ****************** Error parsing JSON for ${response.url}: ${e.message}`)
            logText.push(data)
            logText.push('')
            return { failed: true, output: logText }
        }

        logText.push(`    result: ${JSON.stringify(response.result)}`)
        logText.push('')

        // Sort any arrays as the order can be variable, easier to compare them in the same order
        sortArrays(expectedValues)
        sortArrays(response.result)

        // Flatten out to a single object using the library linked above.
        // Each property of this object has a multi-level key (e.g. assessments[0].offenceDetails[1].offenceType) plus the value
        const expectedElements = flatten(expectedValues)
        const actualElements = flatten(response.result)

        // Check that all expected elements have been received and are correct
        Object.keys(expectedElements).forEach((key) => {
            if (mode != 'ignoreDates' || !key.toUpperCase().includes('DATE')) {  // Ignore dates if in 'ignoreDates' mode
                if (Object.keys(actualElements).includes(key)) {
                    if (expectedElements[key] != actualElements[key]) {
                        logText.push(`Incorrect value for ${key}: expected '${expectedElements[key]}', received '${actualElements[key]}'`)
                        failed = true
                    }
                }
                else {
                    logText.push(`Expected element not received: ${key} with value '${expectedElements[key]}'`)
                    failed = true
                }
            }
        })

        // If in strict mode, check that there are no extra elements received
        if (mode != 'subset') {
            Object.keys(actualElements).forEach((key) => {
                if (!Object.keys(expectedElements).includes(key)) {
                    logText.push(`Received element not expected: ${key} with value '${actualElements[key]}'`)
                    failed = true
                }
            })
        }
    }

    if (failed) {
        logText.push('************* FAILED *************')
    } else {
        logText.push('Passed')
    }
    logText.push('')
    logText.push('')
    return { failed: failed, output: logText }

}

// Sort all arrays in the expected and received objects recursively, to simplify matching
function sortArrays(obj: any) {

    if (!obj) return

    const isArray = obj instanceof Array
    if (isArray) {
        obj.forEach((item) => { sortArrays(item) })
        obj.sort(arraySort)
    } else if (typeof obj == 'object') {
        Object.keys(obj).forEach((key) => {
            sortArrays(obj[key])
        })
    }
}

function arraySort(a: object, b: object): number {

    const aString = concatObject(a)
    const bString = concatObject(b)

    return aString > bString ? 1 : aString < bString ? -1 : 0
}

// Concatenate all properties in an object to create a sort order
function concatObject(obj: object): string {

    let result = ''
    Object.keys(obj).sort().forEach((key) => {
        result += obj[key]
    })
    return result
}


