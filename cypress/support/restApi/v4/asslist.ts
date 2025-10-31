import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter(v4Common.assessmentWithRsrFilter)
    if (relevantAssessments.length == 0) {
        return offenderData.assessments.length == 0 ? env.restErrorResults.noAssessments : env.restErrorResults.noMatchingAssessments
    } else {
        const result = new V4AsslistEndpointResponse(offenderData, parameters)

        delete result.assessments

        return result
    }
}


export class V4AsslistEndpointResponse extends v4Common.V4EndpointResponse {

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

}