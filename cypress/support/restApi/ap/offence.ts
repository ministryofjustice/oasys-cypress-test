import * as common from '../common'
import * as apCommon from './apCommon'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APOffenceEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APOffenceEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APOffenceAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APOffenceAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addOffencesDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APOffenceAssessment extends apCommon.APAssessmentCommon {

    offenceAnalysis: string
    victimPerpetratorRel: string
    victimInfo: string
    victimImpact: string
    othersInvolved: string
    offenceMotivation: string
    acceptsResponsibility: string
    patternOffending: string
    issueContributingToRisk: string


    addOffencesDetails(assessment: dbClasses.DbAssessment) {

        this.offenceAnalysis = common.getTextAnswer(assessment.textData, '2', '2.1')
        this.victimPerpetratorRel = common.getTextAnswer(assessment.textData, '2', '2.4.2')
        this.victimInfo = common.getTextAnswer(assessment.textData, '2', '2.4.1')
        this.victimImpact = common.getTextAnswer(assessment.textData, '2', '2.5')
        this.othersInvolved = common.getTextAnswer(assessment.textData, '2', '2.7.3')
        this.offenceMotivation = common.getTextAnswer(assessment.textData, '2', '2.8')
        this.acceptsResponsibility = common.getTextAnswer(assessment.textData, '2', '2.11.t')
        this.patternOffending = common.getTextAnswer(assessment.textData, '2', '2.12')
        this.issueContributingToRisk = common.getTextAnswer(assessment.textData, '2', '2.98')
    }
}

