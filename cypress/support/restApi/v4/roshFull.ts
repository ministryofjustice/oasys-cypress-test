import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RoshFullEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RoshFullEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RoshFullAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RoshFullAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RoshFullAssessment extends v4Common.V4AssessmentCommon {

    currentOffenceDetails: string
    situationWithRiskToIdentifiableChildren: string
    currentConcernsRiskOfSuicide: string
    currentConcernsRiskOfSelfHarm: string
    currentConcernsHostel: string
    previousConcernsHostelCoping: string
    situationGiveDetails: string
    currentWhereAndWhen: string
    childProtectionConferencesDetails: string
    currentCustodyHostelCoping: string
    previousCustodyHostelCoping: string
    currentVulnerability: string
    previousVulnerability: string
    riskOfSeriousHarm: string
    currentConcernsEscapeText: string
    previousConcernsEscapeText: string
    currentConcernsDisruptiveText: string
    previousConcernsDisruptiveText: string
    currentConcernsBreachOfTrustText: string
    previousConcernsBreachOfTrustText: string
    currentHowDone: string
    currentConcernsSelfHarmSuicide: string
    currentWhoVictims: string
    currentAnyoneElsePresent: string
    currentWhyDone: string
    currentSources: string
    previousWhatDone: string
    previousWhereAndWhen: string
    previousHowDone: string
    previousWhoVictims: string
    previousAnyoneElsePresent: string
    previousWhyDone: string
    previousSources: string
    riskToIdentifiableChildren: string
    childProtectionConferences: string
    localAuthorityKeyWorker: string
    otherAgencies: string
    additionalInformation: string
    dateChildProtectionIssuesKnownToAssessor: string
    dateChildSafeguardingIssuesKnownToAssessor: string
    currentACCT: string
    bookNumber: string
    pastSuicideConcerns: string
    pastSelfHarmConcerns: string
    previousConcernsSelfHarmSuicide: string
    currentConcernsCustody: string
    previousConcernsCustodyCoping: string
    currentConcernsVulnerability: string
    previousConcernsVulnerability: string
    tickRiskOfSeriousHarm: string
    currentConcernsEscape: string
    previousConcernsEscape: string
    currentConcernsDisruptive: string
    previousConcernsDisruptive: string
    currentConcernsBreachOfTrust: string
    previousConcernsBreachOfTrust: string
    identifyBehavioursIncidents: string
    analysisSuicideSelfharm: string
    analysisCoping: string
    analysisVulnerabilities: string
    analysisEscapeAbscond: string
    analysisControlBehaveTrust: string
    analysisBehavioursIncidents: string



    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.currentOffenceDetails = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA1')
        this.situationWithRiskToIdentifiableChildren = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA16')
        this.currentConcernsRiskOfSuicide = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA31')
        this.currentConcernsRiskOfSelfHarm = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA32')
        this.currentConcernsHostel = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA40')
        this.previousConcernsHostelCoping = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA43')
        this.situationGiveDetails = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA17')
        this.currentWhereAndWhen = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA2')
        this.childProtectionConferencesDetails = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA26.t')
        this.currentCustodyHostelCoping = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA41')
        this.previousCustodyHostelCoping = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA44')
        this.currentVulnerability = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA45.t')
        this.previousVulnerability = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA47.t')
        this.riskOfSeriousHarm = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA49.t')
        this.currentConcernsEscapeText = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA51.t')
        this.previousConcernsEscapeText = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA53.t')
        this.currentConcernsDisruptiveText = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA55.t')
        this.previousConcernsDisruptiveText = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA56.t')
        this.currentConcernsBreachOfTrustText = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA58.t')
        this.previousConcernsBreachOfTrustText = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA60.t')
        this.currentHowDone = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA3')
        this.currentConcernsSelfHarmSuicide = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA33')
        this.currentWhoVictims = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA4')
        this.currentAnyoneElsePresent = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA5')
        this.currentWhyDone = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA6')
        this.currentSources = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA7')
        this.previousWhatDone = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA8')
        this.previousWhereAndWhen = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA9')
        this.previousHowDone = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA10')
        this.previousWhoVictims = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA11')
        this.previousAnyoneElsePresent = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA12')
        this.previousWhyDone = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA13')
        this.previousSources = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA14')
        this.riskToIdentifiableChildren = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA15')
        this.childProtectionConferences = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA26')
        this.localAuthorityKeyWorker = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA27')
        this.otherAgencies = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA28')
        this.additionalInformation = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA29')
        this.dateChildProtectionIssuesKnownToAssessor = common.getReformattedDateAnswer(dbAssessment.textData, 'ROSHFULL', 'FA30')
        this.dateChildSafeguardingIssuesKnownToAssessor = common.getReformattedDateAnswer(dbAssessment.textData, 'ROSHFULL', 'FA302')
        this.currentACCT = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA34')
        this.bookNumber = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA35')
        this.pastSuicideConcerns = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA36')
        this.pastSelfHarmConcerns = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA37')
        this.previousConcernsSelfHarmSuicide = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA38')
        this.currentConcernsCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA39')
        this.previousConcernsCustodyCoping = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA42')
        this.currentConcernsVulnerability = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA45')
        this.previousConcernsVulnerability = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA47')
        this.tickRiskOfSeriousHarm = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA49')
        this.currentConcernsEscape = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA51')
        this.previousConcernsEscape = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA53')
        this.currentConcernsDisruptive = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA55')
        this.previousConcernsDisruptive = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA56')
        this.currentConcernsBreachOfTrust = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA58')
        this.previousConcernsBreachOfTrust = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA60')
        this.identifyBehavioursIncidents = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA61')
        this.analysisSuicideSelfharm = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA62')
        this.analysisCoping = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA63')
        this.analysisVulnerabilities = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA64')
        this.analysisEscapeAbscond = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA65')
        this.analysisControlBehaveTrust = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA66')
        this.analysisBehavioursIncidents = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA67')
        
    }
}
