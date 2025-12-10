import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section11EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section11EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section11Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section11Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section11Assessment extends v4Common.V4AssessmentCommon {

    interpersonalSkills: string
    impulsivity: string
    aggressiveControllingBehavour: string
    temperControl: string
    recogniseProblems: string
    problemSolvingSkills: string
    awarenessOfConsequences: string
    achieveGoals: string
    understandsViewsOfOthers: string
    concreteAbstractThinking: string
    sexualPreOccupation: string
    offenceRelatedSexualInterests: string
    thinkIssuesDetails: string
    thinkLinkedToHarm: string
    thinkLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.interpersonalSkills = common.getSingleAnswer(dbAssessment.qaData, '11', '11.1')
        this.impulsivity = common.getSingleAnswer(dbAssessment.qaData, '11', '11.2')
        this.aggressiveControllingBehavour = common.getSingleAnswer(dbAssessment.qaData, '11', '11.3')
        this.temperControl = common.getSingleAnswer(dbAssessment.qaData, '11', '11.4')
        this.recogniseProblems = common.getSingleAnswer(dbAssessment.qaData, '11', '11.5')
        this.problemSolvingSkills = common.getSingleAnswer(dbAssessment.qaData, '11', '11.6')
        this.awarenessOfConsequences = common.getSingleAnswer(dbAssessment.qaData, '11', '11.7')
        this.achieveGoals = common.getSingleAnswer(dbAssessment.qaData, '11', '11.8')
        this.understandsViewsOfOthers = common.getSingleAnswer(dbAssessment.qaData, '11', '11.9')
        this.concreteAbstractThinking = common.getSingleAnswer(dbAssessment.qaData, '11', '11.10')
        this.sexualPreOccupation = common.getSingleAnswer(dbAssessment.qaData, '11', '11.11')
        this.offenceRelatedSexualInterests = common.getSingleAnswer(dbAssessment.qaData, '11', '11.12')
        this.thinkIssuesDetails = common.getTextAnswer(dbAssessment.textData, '11', '11.97')
        this.thinkLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '11', '11.98')
        this.thinkLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '11', '11.99')
    }
}
