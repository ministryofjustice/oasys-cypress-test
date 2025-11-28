import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section1EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section1EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section1Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section1Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section1Assessment extends v4Common.V4AssessmentCommon {

    numberOfPreviousCautionsEtc: number
    numberPrevConvictionsViolentOffences: number
    numSanctionsViolentOffences: number
    dateOfCurrentConviction: string
    everCommittedSexualOffence: string
    contactAgainstStrangerVictim: string
    totOfSanctions: number
    dateSanctionOfSexualOffence: string
    numSanctionsContactAdult: number
    numSanctionsContactChild: number
    numSanctionsIndecentImagesChild: number
    numSanctionsNonContactSexual: number
    dateCommSentenceOrEarliestRelease: string
    currOffenceSexualMotivation: string
    currOffenceAgainstStranger: string
    committedFurtherOffences: string
    courtAppearancesUnder18: number
    courtAppearancesOver18: number
    ageAtFirstConviction: number
    ageAtFirstSanction: number
    courtAppearancesUnder18Score: string
    courtAppearancesOver18Score: string
    ageAtFirstConvictionScore: string
    dateOfFirstSanctionScore: string
    dateOfFirstSanction: string
    ospIRisk: string
    ospCRisk: string
    likelihoodOfSeriousReoffendingNext2Years: string
    sexualElementCommitted16orOver: number
    auditOfDateIntoCommunity: string
    currDirectContactOffenceAgainstStranger: string
    numDirectContactSanctionsChild: number
    numSanctionsIndecentChildImageOrIndirectContact: number
    ospIICRisk: string
    ospDCRisk: string

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.numberOfPreviousCautionsEtc = common.getNumericAnswer(dbAssessment.textData, '1', '1.24')
        this.numberPrevConvictionsViolentOffences = common.getNumericAnswer(dbAssessment.textData, '1', '1.26')
        this.numSanctionsViolentOffences = common.getNumericAnswer(dbAssessment.textData, '1', '1.40')
        this.dateOfCurrentConviction = common.getReformattedDateAnswer(dbAssessment.textData, '1', '1.29')
        this.everCommittedSexualOffence = common.getSingleAnswer(dbAssessment.qaData, '1', '1.30')
        this.contactAgainstStrangerVictim = common.getSingleAnswer(dbAssessment.qaData, '1', '1.31')
        this.totOfSanctions = common.getNumericAnswer(dbAssessment.textData, '1', '1.32')
        this.dateSanctionOfSexualOffence = common.getReformattedDateAnswer(dbAssessment.textData, '1', '1.33')
        this.numSanctionsContactAdult = common.getNumericAnswer(dbAssessment.textData, '1', '1.34')
        this.numSanctionsContactChild = common.getNumericAnswer(dbAssessment.textData, '1', '1.35')
        this.numSanctionsIndecentImagesChild = common.getNumericAnswer(dbAssessment.textData, '1', '1.36')
        this.numSanctionsNonContactSexual = common.getNumericAnswer(dbAssessment.textData, '1', '1.37')
        this.dateCommSentenceOrEarliestRelease = common.getReformattedDateAnswer(dbAssessment.textData, '1', '1.38')
        this.currOffenceSexualMotivation = common.getSingleAnswer(dbAssessment.qaData, '1', '1.41')
        this.currOffenceAgainstStranger = common.getSingleAnswer(dbAssessment.qaData, '1', '1.42')
        this.committedFurtherOffences = common.getReformattedDateAnswer(dbAssessment.textData, '1', '1.43')
        this.courtAppearancesUnder18 = common.getNumericAnswer(dbAssessment.textData, '1', '1.5')
        this.courtAppearancesOver18 = common.getNumericAnswer(dbAssessment.textData, '1', '1.6')
        this.ageAtFirstConviction = common.getNumericAnswer(dbAssessment.textData, '1', '1.7')
        this.ageAtFirstSanction = common.getNumericAnswer(dbAssessment.textData, '1', '1.8')
        this.courtAppearancesUnder18Score = common.getSingleAnswer(dbAssessment.qaData, '1', '1.5.1')
        this.courtAppearancesOver18Score = common.getSingleAnswer(dbAssessment.qaData, '1', '1.6.1')
        this.ageAtFirstConvictionScore = common.getSingleAnswer(dbAssessment.qaData, '1', '1.7.1')
        this.dateOfFirstSanctionScore = common.getSingleAnswer(dbAssessment.qaData, '1', '1.8.1')
        this.dateOfFirstSanction = common.getReformattedDateAnswer(dbAssessment.textData, '1', '1.8.2')
        if (this.dateOfFirstSanction == '') {
            this.dateOfFirstSanction = common.getReformattedDateAnswer(dbAssessment.textData, '1', '1.7.2')
        }
        this.ospIRisk = common.getTextAnswer(dbAssessment.textData, '1', 'D1', 'additionalNote')
        this.ospCRisk = common.getTextAnswer(dbAssessment.textData, '1', 'D2', 'additionalNote')
        this.likelihoodOfSeriousReoffendingNext2Years = common.getTextAnswer(dbAssessment.textData, '1', 'D3', 'additionalNote')
        this.sexualElementCommitted16orOver = common.getNumericAnswer(dbAssessment.textData, '1', 'S1.54')
        this.auditOfDateIntoCommunity = common.getTextAnswer(dbAssessment.textData, '1', '1.38.t')
        this.currDirectContactOffenceAgainstStranger = common.getSingleAnswer(dbAssessment.qaData, '1', '1.44')
        this.numDirectContactSanctionsChild = common.getNumericAnswer(dbAssessment.textData, '1', '1.45')
        this.numSanctionsIndecentChildImageOrIndirectContact = common.getNumericAnswer(dbAssessment.textData, '1', '1.46')
        this.ospIICRisk = common.getTextAnswer(dbAssessment.textData, '1', 'D5', 'additionalNote')
        this.ospDCRisk = common.getTextAnswer(dbAssessment.textData, '1', 'D6', 'additionalNote')

    }
}
