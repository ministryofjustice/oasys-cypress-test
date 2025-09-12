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
        const result = new APNeedsEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        cy.wrap(result).as(resultAlias)
    }
}

export class APNeedsEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APNeedsAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APNeedsAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addOffencesDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APNeedsAssessment extends apCommon.APAssessmentCommon {

    offenceAnalysisDetails: string
    offenceLinkedToHarm: string
    accIssuesDetails: string
    accLinkedToHarm: string
    accLinkedToReoffending: string
    eTEIssuesDetails: string
    eTELinkedToHarm: string
    eTELinkedToReoffending: string
    financeIssuesDetails: string
    financeLinkedToHarm: string
    financeLinkedToReoffending: string
    relIssuesDetails: string
    relLinkedToHarm: string
    relLinkedToReoffending: string
    lifestyleIssuesDetails: string
    lifestyleLinkedToHarm: string
    lifestyleLinkedToReoffending: string
    drugIssuesDetails: string
    drugLinkedToHarm: string
    drugLinkedToReoffending: string
    alcoholIssuesDetails: string
    alcoholLinkedToHarm: string
    alcoholLinkedToReoffending: string
    emoIssuesDetails: string
    emoLinkedToHarm: string
    emoLinkedToReoffending: string
    thinkIssuesDetails: string
    thinkLinkedToHarm: string
    thinkLinkedToReoffending: string
    attIssuesDetails: string
    attLinkedToHarm: string
    attLinkedToReoffending: string


    addOffencesDetails(assessment: dbClasses.DbAssessment) {

        this.offenceAnalysisDetails = common.getTextAnswer(assessment.textData, '2', '2.98')
        this.offenceLinkedToHarm = common.getSingleAnswer(assessment.qaData, '2', '2.99')

        this.accIssuesDetails = common.getTextAnswer(assessment.textData, '3', '3.97')
        this.accLinkedToHarm = common.getSingleAnswer(assessment.qaData, '3', '3.98')
        this.accLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '3', '3.99')

        this.eTEIssuesDetails = common.getTextAnswer(assessment.textData, '4', '4.94')
        this.eTELinkedToHarm = common.getSingleAnswer(assessment.qaData, '4', '4.96')
        this.eTELinkedToReoffending = common.getSingleAnswer(assessment.qaData, '4', '4.98')

        this.financeIssuesDetails = common.getTextAnswer(assessment.textData, '5', '5.97')
        this.financeLinkedToHarm = common.getSingleAnswer(assessment.qaData, '5', '5.98')
        this.financeLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '5', '5.99')

        this.relIssuesDetails = common.getTextAnswer(assessment.textData, '6', '6.97')
        this.relLinkedToHarm = common.getSingleAnswer(assessment.qaData, '6', '6.98')
        this.relLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '6', '6.99')

        this.lifestyleIssuesDetails = common.getTextAnswer(assessment.textData, '7', '7.97')
        this.lifestyleLinkedToHarm = common.getSingleAnswer(assessment.qaData, '7', '7.98')
        this.lifestyleLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '7', '7.99')

        this.drugIssuesDetails = common.getTextAnswer(assessment.textData, '8', '8.97')
        this.drugLinkedToHarm = common.getSingleAnswer(assessment.qaData, '8', '8.98')
        this.drugLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '8', '8.99')

        this.alcoholIssuesDetails = common.getTextAnswer(assessment.textData, '9', '9.97')
        this.alcoholLinkedToHarm = common.getSingleAnswer(assessment.qaData, '9', '9.98')
        this.alcoholLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '9', '9.99')

        this.emoIssuesDetails = common.getTextAnswer(assessment.textData, '10', '10.97')
        this.emoLinkedToHarm = common.getSingleAnswer(assessment.qaData, '10', '10.98')
        this.emoLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '10', '10.99')

        this.thinkIssuesDetails = common.getTextAnswer(assessment.textData, '11', '11.97')
        this.thinkLinkedToHarm = common.getSingleAnswer(assessment.qaData, '11', '11.98')
        this.thinkLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '11', '11.99')

        this.attIssuesDetails = common.getTextAnswer(assessment.textData, '12', '12.97')
        this.attLinkedToHarm = common.getSingleAnswer(assessment.qaData, '12', '12.98')
        this.attLinkedToReoffending = common.getSingleAnswer(assessment.qaData, '12', '12.99')
    }
}
