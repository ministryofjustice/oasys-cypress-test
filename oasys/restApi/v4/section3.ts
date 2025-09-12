import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        cy.wrap(env.restErrorResults.noAssessments).as(resultAlias)

    } else {
        const result = new Section3EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        cy.wrap(result).as(resultAlias)
    }
}

export class Section3EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section3Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section3Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section3Assessment extends v4Common.V4AssessmentCommon {

    noFixedAbodeOrTransient: string
    suitabilityOfAccommodation: string
    permanenceOfAccommodation: string
    locationOfAccommodation: string
    accIssuesDetails: string
    accLinkedToHarm: string
    accLinkedToReoffending: string

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.noFixedAbodeOrTransient = common.getSingleAnswer(dbAssessment.qaData, '3', '3.3')
        this.suitabilityOfAccommodation = common.getSingleAnswer(dbAssessment.qaData, '3', '3.4')
        this.permanenceOfAccommodation = common.getSingleAnswer(dbAssessment.qaData, '3', '3.5')
        this.locationOfAccommodation = common.getSingleAnswer(dbAssessment.qaData, '3', '3.6')
        this.accIssuesDetails = common.getTextAnswer(dbAssessment.textData, '3', '3.97')
        this.accLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '3', '3.98')
        this.accLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '3', '3.99')
    }
}

