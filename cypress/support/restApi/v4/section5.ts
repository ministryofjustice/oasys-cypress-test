import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section5EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section5EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section5Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section5Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section5Assessment extends v4Common.V4AssessmentCommon {

    financialSituation: string
    financialManagement: string
    illegalEarnings: string
    overReliance: string
    budgeting: string
    financeIssuesDetails: string
    financeLinkedToHarm: string
    financeLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.financialSituation = common.getSingleAnswer(dbAssessment.qaData, '5', '5.2')
        this.financialManagement = common.getSingleAnswer(dbAssessment.qaData, '5', '5.3')
        this.illegalEarnings = common.getSingleAnswer(dbAssessment.qaData, '5', '5.4')
        this.overReliance = common.getSingleAnswer(dbAssessment.qaData, '5', '5.5')
        this.budgeting = common.getSingleAnswer(dbAssessment.qaData, '5', '5.6')
        this.financeIssuesDetails = common.getTextAnswer(dbAssessment.textData, '5', '5.97')
        this.financeLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '5', '5.98')
        this.financeLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '5', '5.99')
    }
}
