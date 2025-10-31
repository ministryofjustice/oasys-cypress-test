import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section12EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section12EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section12Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section12Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section12Assessment extends v4Common.V4AssessmentCommon {

    proCriminalAttitudes: string
    attitudesTowardsStaff: string
    attitudesTowardsSupervision: string
    attitudesTowardsCommunitySociety: string
    understandsMotivationForOffending: string
    motivationToAddressBehaviour: string
    hostileOrientation: string
    attIssuesDetails: string
    attLinkedToHarm: string
    attLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.proCriminalAttitudes = common.getSingleAnswer(dbAssessment.qaData, '12', '12.1')
        this.attitudesTowardsStaff = common.getSingleAnswer(dbAssessment.qaData, '12', '12.3')
        this.attitudesTowardsSupervision = common.getSingleAnswer(dbAssessment.qaData, '12', '12.4')
        this.attitudesTowardsCommunitySociety = common.getSingleAnswer(dbAssessment.qaData, '12', '12.5')
        this.understandsMotivationForOffending = common.getSingleAnswer(dbAssessment.qaData, '12', '12.6')
        this.motivationToAddressBehaviour = common.getSingleAnswer(dbAssessment.qaData, '12', '12.8')
        this.hostileOrientation = common.getSingleAnswer(dbAssessment.qaData, '12', '12.9')
        this.attIssuesDetails = common.getTextAnswer(dbAssessment.textData, '12', '12.97')
        this.attLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '12', '12.98')
        this.attLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '12', '12.99')
    }
}
