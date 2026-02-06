import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from '../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RmpEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RmpEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RmpAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RmpAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RmpAssessment extends v4Common.V4AssessmentCommon {

    referredToMappaLevel2: string
    referredToMappaLevel3: string
    tickUseOfWeapons: string
    shouldBeCriticalPublicProtectionCaseNow: string
    registeredUnderSexOffenderAct: string
    arson: string
    shouldBeReferredToMappaLevel2: string
    shouldBeCriticalPublicProtectionCasePreRelease: string
    tickAccommodation: string
    shouldBeReferredToMappaLevel3: string
    tickEte: string
    tickFinances: string
    criticalPublicProtectionCase: string
    tickRelationships: string
    tickLifestyleAndAssociates: string
    tickDrugMisuse: string
    requiredToRegisterUnderSexOffenderAct: string
    tickAlcoholMisuse: string
    disqualifiedFromWorkingWithChildren: string
    tickEmotionalWellbeing: string
    presentOrPreviousConvictionAgainstChild: string
    tickThinkingAndBehaviour: string
    ongoingRiskToChildren: string
    tickAttitudes: string
    notifyPriorToRelease: string
    tickDomesticAbuse: string
    publicProtectionManualRestrictions: string
    tickHateCrime: string
    conditionallyDischargedPatient: string
    tickStalking: string
    lifeLicence: string
    tickIntegratedChildSafeguardingPlan: string
    extendedSentence: string
    tickSelfHarmSuicide: string
    eligibleForEarlyAllocation: string
    tickCopingInCustody: string
    tickVulnerability: string
    tickEscapeAbscondRisks: string
    tickRiskToChildren: string
    tickRiskToKnownAdult: string
    tickRiskToPrisoners: string
    tickRiskToStaff: string
    tickRiskToPublic: string
    tickEmotionalCongruenceWithChildren: string
    tickSexualPreOccupation: string
    tickOffenceRelatedSexualInterests: string
    tickHostileOrientation: string
    tickVictimSafetyPlanning: string
    tickSanEmploymentAndEducation
    tickSanPersonalRelationshipsAndCommunity: string
    tickSanDrugUse: string
    tickSanAlcoholUse: string
    tickSanHealthAndWellbeing: string
    tickSanThinkingBehavioursAndAttitudes: string
    keyInformationAboutCurrentSituation: string
    furtherConsiderations: string
    supervision: string
    monitoringAndControl: string
    reduceRisk: string
    interventionsAndTreatment: string
    victimSafetyPlanning: string
    increaseRisk: string
    contingencyPlans: string
    additionalComments: string
    factorsStrengthsAndProtective: string
    pre4PillarsCurrentSituation: string
    pre4PillarsOtherAgencies: string
    pre4PillarsExistingSupport: string
    pre4PillarsAddedMeasures: string
    pre4PillarsWho: string
    pre4PillarsAdditionalConditions: string
    pre4PillarsLevelOfContact: string
    pre4PillarsContingency: string
    pre4PillarsAdditionalComments: string



    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.referredToMappaLevel2 = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM1')
        this.referredToMappaLevel3 = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM2')
        this.tickUseOfWeapons = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.1.1')
        this.shouldBeCriticalPublicProtectionCaseNow = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM6')
        this.registeredUnderSexOffenderAct = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM9')
        this.arson = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.2.1')
        this.shouldBeReferredToMappaLevel2 = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM3')
        this.shouldBeCriticalPublicProtectionCasePreRelease = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM7')
        this.tickAccommodation = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.3.1')
        this.shouldBeReferredToMappaLevel3 = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM4')
        this.tickEte = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.4.1')
        this.tickFinances = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.5.1')
        this.criticalPublicProtectionCase = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM5')
        this.tickRelationships = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.6.1')
        this.tickLifestyleAndAssociates = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.7.1')
        this.tickDrugMisuse = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.8.1')
        this.requiredToRegisterUnderSexOffenderAct = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM8')
        this.tickAlcoholMisuse = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.9.1')
        this.disqualifiedFromWorkingWithChildren = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM10')
        this.tickEmotionalWellbeing = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.10.1')
        this.presentOrPreviousConvictionAgainstChild = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM11')
        this.tickThinkingAndBehaviour = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.11.1')
        this.ongoingRiskToChildren = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM12')
        this.tickAttitudes = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.12.1')
        this.notifyPriorToRelease = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM13')
        this.tickDomesticAbuse = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.13.1')
        this.publicProtectionManualRestrictions = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM14')
        this.tickHateCrime = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.14.1')
        this.conditionallyDischargedPatient = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM15')
        this.tickStalking = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.15.1')
        this.lifeLicence = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM16')
        this.tickIntegratedChildSafeguardingPlan = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.16.1')
        this.extendedSentence = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM17')
        this.tickSelfHarmSuicide = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.17.1')
        this.eligibleForEarlyAllocation = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM11.13')
        this.tickCopingInCustody = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.18.1')
        this.tickVulnerability = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.19.1')
        this.tickEscapeAbscondRisks = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.20.1')
        this.tickRiskToChildren = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.21.1')
        this.tickRiskToKnownAdult = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.22.1')
        this.tickRiskToPrisoners = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.23.1')
        this.tickRiskToStaff = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.24.1')
        this.tickRiskToPublic = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.30.1')
        this.tickEmotionalCongruenceWithChildren = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.25.1')
        this.tickSexualPreOccupation = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.26.1')
        this.tickOffenceRelatedSexualInterests = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.27.1')
        this.tickHostileOrientation = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.28.1')
        this.tickVictimSafetyPlanning = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.29.1')
        this.tickSanEmploymentAndEducation = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.4.1_SAN')
        this.tickSanPersonalRelationshipsAndCommunity = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.6.1_SAN')
        this.tickSanDrugUse = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.8.1_SAN')
        this.tickSanAlcoholUse = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.9.1_SAN')
        this.tickSanHealthAndWellbeing = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.10.1_SAN')
        this.tickSanThinkingBehavioursAndAttitudes = common.getSingleAnswer(dbAssessment.qaData, 'RMP', 'RM28.0.30.1_SAN')
        this.keyInformationAboutCurrentSituation = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM28.1')
        this.furtherConsiderations = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM28')
        this.supervision = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM30')
        this.monitoringAndControl = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM31')
        this.reduceRisk = common.getTextAnswer(dbAssessment.textData, 'RMP', 'SUM5')
        this.interventionsAndTreatment = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM32')
        this.victimSafetyPlanning = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM33')
        this.increaseRisk = common.getTextAnswer(dbAssessment.textData, 'RMP', 'SUM4')
        this.contingencyPlans = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM34')
        this.additionalComments = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM35')
        this.factorsStrengthsAndProtective = common.getTextAnswer(dbAssessment.textData, 'RMP', 'SUM10')
        this.pre4PillarsCurrentSituation = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM18')
        this.pre4PillarsOtherAgencies = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM20')
        this.pre4PillarsExistingSupport = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM21')
        this.pre4PillarsAddedMeasures = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM22')
        this.pre4PillarsWho = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM23')
        this.pre4PillarsAdditionalConditions = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM24')
        this.pre4PillarsLevelOfContact = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM25')
        this.pre4PillarsContingency = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM26')
        this.pre4PillarsAdditionalComments = common.getTextAnswer(dbAssessment.textData, 'RMP', 'RM27')
    }
}
