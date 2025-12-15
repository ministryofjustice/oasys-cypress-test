import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RoshSummEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RoshSummEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RoshSummAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RoshSummAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RoshSummAssessment extends v4Common.V4AssessmentCommon {

    whoAtRisk: string
    riskChildrenCommunity: string
    riskPublicCommunity: string
    riskKnownAdultCommunity: string
    riskStaffCommunity: string
    natureOfRisk: string
    riskChildrenCustody: string
    riskPublicCustody: string
    riskKnownAdultCustody: string
    riskStaffCustody: string
    riskPrisonersCustody: string
    riskGreatest: string
    factorsLikelyToIncreaseRisk: string
    factorsLikelyToReduceRisk: string
    factorsAnalysisOfRisk: string
    factorsStrengthsAndProtective: string
    factorsSituationsLikelyToOffend: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.whoAtRisk = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM1')
        this.riskChildrenCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.1.1')
        this.riskPublicCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.2.1')
        this.riskKnownAdultCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.3.1')
        this.riskStaffCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.4.1')
        this.natureOfRisk = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM2')
        this.riskChildrenCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.1.2')
        this.riskPublicCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.2.2')
        this.riskKnownAdultCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.3.2')
        this.riskStaffCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.4.2')
        this.riskPrisonersCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.5.2')
        this.riskGreatest = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM3')
        this.factorsLikelyToIncreaseRisk = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM4')
        this.factorsLikelyToReduceRisk = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM5')
        this.factorsAnalysisOfRisk = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM9')
        this.factorsStrengthsAndProtective = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM10')
        this.factorsSituationsLikelyToOffend = common.getTextAnswer(dbAssessment.textData, 'ROSHSUM', 'SUM11')

    }
}

