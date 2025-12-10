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
        const result = new APRiskAssEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APRiskAssEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRiskAssAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRiskAssAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRiskIndDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRiskAssAssessment extends apCommon.APAssessmentCommon {

    currentOffenceDetails: string
    currentWhereAndWhen: string
    currentHowDone: string
    currentWhoVictims: string
    currentAnyoneElsePresent: string
    currentWhyDone: string
    currentSources: string
    previousOffence: string
    previousWhatDone: string
    previousWhereAndWhen: string
    previousHowDone: string
    previousWhoVictims: string
    previousAnyoneElsePresent: string
    previousWhyDone: string
    previousSources: string
    identifyBehavioursIncidents: string
    analysisBehavioursIncidents: string



    addRiskIndDetails(assessment: dbClasses.DbAssessment) {

        this.currentOffenceDetails = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA1')
        this.currentWhereAndWhen = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA2')
        this.currentHowDone = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA3')
        this.currentWhoVictims = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA4')
        this.currentAnyoneElsePresent = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA5')
        this.currentWhyDone = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA6')
        this.currentSources = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA7')
        this.previousWhatDone = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA8')
        this.previousWhereAndWhen = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA9')
        this.previousHowDone = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA10')
        this.previousWhoVictims = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA11')
        this.previousAnyoneElsePresent = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA12')
        this.previousWhyDone = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA13')
        this.previousSources = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA14')
        this.identifyBehavioursIncidents = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA61')
        this.analysisBehavioursIncidents = common.getTextAnswer(assessment.textData, 'ROSHFULL', 'FA67')
    }
}
