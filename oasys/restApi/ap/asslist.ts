import * as apCommon from './apCommon'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const relevantAssessments = offenderData.assessments.filter(apCommon.assessmentFilter)
    if (relevantAssessments.length == 0) {
        cy.wrap(offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'STANDALONE'].includes(ass.assessmentType))).length == 0
            ? env.restErrorResults.noAssessments : env.restErrorResults.noMatchingAssessments).as(resultAlias)
    } else {
        const result = new APAsslistEndpointResponse(offenderData, parameters)

        result.addTimeline(relevantAssessments)
        delete result.assessments
        delete result.warnings

        cy.wrap(result).as(resultAlias)
    }
}


export class APAsslistEndpointResponse extends apCommon.APEndpointResponse {

    timeline: apCommon.APTimelineAssessment[]

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[]) {

        this.timeline = super.processTimeline(dbAssessments)
    }
}