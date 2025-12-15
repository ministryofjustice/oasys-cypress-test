import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section6EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        const saraAssessments = offenderData.assessments.filter(
            (assessment) =>
                assessment.assessmentType == 'SARA' && (assessment as dbClasses.DbAssessment).parentAssessmentPk == parameters.assessmentPk
        )
        if (saraAssessments.length > 0) {
            result.addSaraDetails(saraAssessments[0] as dbClasses.DbAssessment)
        }
        else {
            result.addSaraDetails(null)
        }
        return result
    }
}

export class Section6EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section6Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section6Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

    addSaraDetails(saraAssessment: dbClasses.DbAssessment) {

        this.assessments[0].SARA = new Sara(saraAssessment)
    }

}

export class Section6Assessment extends v4Common.V4AssessmentCommon {

    relCloseFamily: string
    victimOfPartner: string
    victimOfFamily: string
    perpAgainstPartner: string
    perpAgainstFamily: string
    experienceOfChildhood: string
    relCurrRelationshipStatus: string
    relationshipWithPartner: string
    prevCloseRelationships: string
    prevOrCurrentDomesticAbuse: string
    relParentalResponsibilities: string
    parentalRespProblem: string
    openSexualOffendingQuestions: string
    emotionalCongruence: string
    relIssuesDetails: string
    relLinkedToHarm: string
    relLinkedToReoffending: string

    SARA: Sara

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.relCloseFamily = common.getSingleAnswer(dbAssessment.qaData, '6', '6.1')
        this.experienceOfChildhood = common.getSingleAnswer(dbAssessment.qaData, '6', '6.3')
        this.relCurrRelationshipStatus = common.getSingleAnswer(dbAssessment.qaData, '6', '6.8')
        this.relationshipWithPartner = common.getSingleAnswer(dbAssessment.qaData, '6', '6.4')
        this.prevCloseRelationships = common.getSingleAnswer(dbAssessment.qaData, '6', '6.6')
        this.relParentalResponsibilities = common.getSingleAnswer(dbAssessment.qaData, '6', '6.9')
        this.parentalRespProblem = common.getSingleAnswer(dbAssessment.qaData, '6', '6.10')
        this.openSexualOffendingQuestions = common.getSingleAnswer(dbAssessment.qaData, '6', '6.11')
        this.emotionalCongruence = common.getSingleAnswer(dbAssessment.qaData, '6', '6.12')
        this.relIssuesDetails = common.getTextAnswer(dbAssessment.textData, '6', '6.97')
        this.relLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '6', '6.98')
        this.relLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '6', '6.99')

        if (dbAssessment.initiationDate > common.releaseDate6_30) {
            this.prevOrCurrentDomesticAbuse = common.getSingleAnswer(dbAssessment.qaData, '6', '6.7da')
            this.victimOfPartner = common.getSingleAnswer(dbAssessment.qaData, '6', '6.7.1.1da')
            this.victimOfFamily = common.getSingleAnswer(dbAssessment.qaData, '6', '6.7.1.2da')
            this.perpAgainstPartner = common.getSingleAnswer(dbAssessment.qaData, '6', '6.7.2.1da')
            this.perpAgainstFamily = common.getSingleAnswer(dbAssessment.qaData, '6', '6.7.2.2da')
        } else {
            this.prevOrCurrentDomesticAbuse = common.getSingleAnswer(dbAssessment.qaData, '6', '6.7')

            const da = common.getMultipleAnswers(dbAssessment.qaData, '6', ['6.7.1'], 2)
            if (da != null && da != undefined) {
                this.perpAgainstPartner = da.includes('Perpetrator') ? 'Yes' : null
                this.victimOfPartner = da.includes('Victim') ? 'Yes' : null
            } else {
                this.perpAgainstPartner = null
                this.victimOfPartner = null
            }
            this.perpAgainstFamily = null
            this.victimOfFamily = null
        }
    }

}

export class Sara {

    imminentRiskOfViolenceTowardsPartner: string = null
    imminentRiskOfViolenceTowardsOthers: string = null

    constructor(saraAssessment: dbClasses.DbAssessment) {

        if (saraAssessment != null) {
            this.imminentRiskOfViolenceTowardsPartner = common.getSingleAnswer(saraAssessment.qaData, 'SARA', 'SR76.1.1')
            this.imminentRiskOfViolenceTowardsOthers = common.getSingleAnswer(saraAssessment.qaData, 'SARA', 'SR77.1.1')
        }
    }
}
