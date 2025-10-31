import * as v4Common from './v4Common'
import { OGP, OVP, OGRS, RSR, OSP } from '../riskScoreClasses'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RiskScoresAssEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RiskScoresAssEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RiskScoresAssAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RiskScoresAssAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RiskScoresAssAssessment extends v4Common.V4AssessmentCommon {

    OGP: OGP
    OVP: OVP
    OGRS: OGRS
    RSR: RSR
    OSP: OSP

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        // Remove standard stuff not included in this endpoint
        delete this.assessmentPk
        delete this.assessmentType
        delete this.dateCompleted
        delete this.assessorSignedDate
        delete this.initiationDate
        delete this.assessmentStatus
        delete this.superStatus
        delete this.laterWIPAssessmentExists
        delete this.latestWIPDate
        delete this.laterSignLockAssessmentExists
        delete this.latestSignLockDate
        delete this.laterPartCompSignedAssessmentExists
        delete this.latestPartCompSignedDate
        delete this.laterPartCompUnsignedAssessmentExists
        delete this.latestPartCompUnsignedDate
        delete this.laterCompleteAssessmentExists
        delete this.latestCompleteDate
        delete this.assessor

        this.OGP = new OGP(dbAssessment.riskDetails)
        this.OVP = new OVP(dbAssessment.riskDetails)
        this.OGRS = new OGRS(dbAssessment.riskDetails)
        this.RSR = new RSR(dbAssessment.riskDetails)
        this.OSP = new OSP(dbAssessment.riskDetails)

        // Different name for scoreLevel in this endpoint
        this.RSR['rsrScoreLevel'] = this.RSR.scoreLevel
        delete this.RSR.scoreLevel
    }
}

