import * as v4Common from './v4Common'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const relevantAssessments = offenderData.assessments.filter(v4Common.assessmentWithRsrFilter)
    if (relevantAssessments.length == 0) {
        cy.wrap(offenderData.assessments.filter((ass) => !(['SARA', 'RM2000'].includes(ass.assessmentType))).length == 0
            ? env.restErrorResults.noAssessments : env.restErrorResults.noMatchingAssessments).as(resultAlias)
    } else {
        const result = new V4AsslistEndpointResponse(offenderData, parameters)

        delete result.assessments

        cy.wrap(result).as(resultAlias)
    }
}


export class V4AsslistEndpointResponse extends v4Common.V4EndpointResponse {

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

}