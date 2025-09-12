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
        const result = new APRmpEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        cy.wrap(result).as(resultAlias)
    }
}

export class APRmpEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRmpAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRmpAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRmpDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRmpAssessment extends apCommon.APAssessmentCommon {

    keyInformationAboutCurrentSituation: string
    furtherConsiderations: string
    supervision: string
    monitoringAndControl: string
    interventionsAndTreatment: string
    victimSafetyPlanning: string
    contingencyPlans: string
    additionalComments: string


    addRmpDetails(assessment: dbClasses.DbAssessment) {

        if (['M', 'H', 'V'].includes(assessment.roshLevel)) {

            this.keyInformationAboutCurrentSituation = common.getTextAnswer(assessment.textData, 'RMP', 'RM28.1')
            this.furtherConsiderations = common.getTextAnswer(assessment.textData, 'RMP', 'RM28')
            this.supervision = common.getTextAnswer(assessment.textData, 'RMP', 'RM30')
            this.monitoringAndControl = common.getTextAnswer(assessment.textData, 'RMP', 'RM31')
            this.interventionsAndTreatment = common.getTextAnswer(assessment.textData, 'RMP', 'RM32')
            this.victimSafetyPlanning = common.getTextAnswer(assessment.textData, 'RMP', 'RM33')
            this.contingencyPlans = common.getTextAnswer(assessment.textData, 'RMP', 'RM34')
            this.additionalComments = common.getTextAnswer(assessment.textData, 'RMP', 'RM35')
        }
    }
}
