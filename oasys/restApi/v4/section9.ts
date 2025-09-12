import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        cy.wrap(env.restErrorResults.noAssessments).as(resultAlias)

    } else {
        const result = new Section9EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        cy.wrap(result).as(resultAlias)
    }
}

export class Section9EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section9Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section9Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section9Assessment extends v4Common.V4AssessmentCommon {

    alcoholProblemDescription: string
    currentUse: string
    bingeDrinking: string
    frequencyAndLevel: string
    alcoholViolentBehaviour: string
    alcoholTackleMotivation: string
    alcoholIssuesDetails: string
    alcoholLinkedToHarm: string
    alcoholLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.alcoholProblemDescription = common.getTextAnswer(dbAssessment.textData, '9', '9.1.t')
        this.currentUse = common.getSingleAnswer(dbAssessment.qaData, '9', '9.1')
        this.bingeDrinking = common.getSingleAnswer(dbAssessment.qaData, '9', '9.2')
        this.frequencyAndLevel = common.getSingleAnswer(dbAssessment.qaData, '9', '9.3')
        this.alcoholViolentBehaviour = common.getSingleAnswer(dbAssessment.qaData, '9', '9.4')
        this.alcoholTackleMotivation = common.getSingleAnswer(dbAssessment.qaData, '9', '9.5')
        this.alcoholIssuesDetails = common.getTextAnswer(dbAssessment.textData, '9', '9.97')
        this.alcoholLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '9', '9.98')
        this.alcoholLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '9', '9.99')
    }
}
