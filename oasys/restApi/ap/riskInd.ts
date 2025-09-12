import * as common from '../common'
import * as apCommon from './apCommon'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        cy.wrap(env.restErrorResults.noAssessments).as(resultAlias)

    } else {
        const result = new APRiskIndEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        cy.wrap(result).as(resultAlias)
    }
}

export class APRiskIndEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRiskIndAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRiskIndAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRiskIndDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRiskIndAssessment extends apCommon.APAssessmentCommon {

    concernsRiskOfSuicide: string
    concernsRiskOfSelfHarm: string
    currentConcernsRiskOfSuicide: string
    currentConcernsRiskOfSelfHarm: string
    currentConcernsSelfHarmSuicide: string
    previousConcernsSelfHarmSuicide: string
    currentCustodyHostelCoping: string
    previousCustodyHostelCoping: string
    currentVulnerability: string
    previousVulnerability: string
    riskOfSeriousHarm: string
    concernsBreachOfTrust: string
    currentConcernsBreachOfTrust: string
    currentConcernsBreachOfTrustText: string


    addRiskIndDetails(assessment: dbClasses.DbAssessment) {

        this.concernsRiskOfSuicide = common.getSingleAnswer(assessment.qaData, 'ROSH', 'R3.1')
        this.concernsRiskOfSelfHarm = common.getSingleAnswer(assessment.qaData, 'ROSH', 'R3.2')
        this.concernsBreachOfTrust = common.getSingleAnswer(assessment.qaData, 'ROSH', 'R4.3')

        this.currentConcernsRiskOfSuicide = common.getSingleAnswer(assessment.qaData, 'ROSHFULL', 'FA31')
        this.currentConcernsRiskOfSelfHarm = common.getSingleAnswer(assessment.qaData, 'ROSHFULL', 'FA32')
        this.currentConcernsSelfHarmSuicide = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA33')
        this.previousConcernsSelfHarmSuicide = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA38')
        this.currentCustodyHostelCoping = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA41')
        this.previousCustodyHostelCoping = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA44')
        this.currentVulnerability = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA45.t')
        this.previousVulnerability = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA47.t')
        this.riskOfSeriousHarm = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA49.t')
        this.currentConcernsBreachOfTrust = common.getSingleAnswer(assessment.qaData, 'ROSHFULL', 'FA58')
        this.currentConcernsBreachOfTrustText = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA58.t')
    }
}
