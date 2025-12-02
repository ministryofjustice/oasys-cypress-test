import * as common from '../common'
import * as v3Common from './v3Common'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'
import { NewActuarialPredictors } from '../riskScoreClasses'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    // This class handles both AssSumm and AssSummSan (no SP details on the SAN version), using the SAN indicator field to determine which type is required.
    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new AssSummNeedsEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)
        result.assessments[0].offender = new Offender(offenderData)

        return result
    }
}

export class AssSummNeedsEndpointResponse extends v3Common.V3EndpointResponse {

    assessments: AssSummAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, AssSummAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addAssSummDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class AssSummAssessment extends v3Common.V3AssessmentCommon {

    riskChildrenCommunity: string
    riskChildrenCustody: string
    riskPublicCommunity: string
    riskPublicCustody: string
    riskKnownAdultCommunity: string
    riskKnownAdultCustody: string
    riskStaffCommunity: string
    riskStaffCustody: string
    riskPrisonersCustody: string
    currentConcernsRiskOfSuicide: string
    currentConcernsRiskOfSelfHarm: string
    currentConcernsCustody: string
    currentConcernsHostel: string
    currentConcernsVulnerability: string
    currentConcernsEscape: string
    currentConcernsDisruptive: string
    currentConcernsBreachOfTrust: string
    analysisSuicideSelfharm: string
    analysisCoping: string
    analysisVulnerabilities: string
    analysisEscapeAbscond: string
    analysisControlBehaveTrust: string

    initialSpDate: string
    reviewSpDate: string
    reviewNum: string

    weightedScores: WeightedScores
    furtherInformation: FurtherInformation
    offender: Offender
    newActuarialPredictors: NewActuarialPredictors
    ogpOvp: OgpOvp

    basicSentencePlan: BasicSentencePlanArea[] = null
    sentencePlan: SentencePlan = null

    indicators: Indicators
    offences: Offence[] = []

    addAssSummDetails(dbAssessment: dbClasses.DbAssessment) {

        this.riskChildrenCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.1.1')
        this.riskChildrenCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.1.2')
        this.riskPublicCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.2.1')
        this.riskPublicCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.2.2')
        this.riskKnownAdultCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.3.1')
        this.riskKnownAdultCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.3.2')
        this.riskStaffCommunity = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.4.1')
        this.riskStaffCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.4.2')
        this.riskPrisonersCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHSUM', 'SUM6.5.2')

        this.currentConcernsRiskOfSuicide = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA31')
        this.currentConcernsRiskOfSelfHarm = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA32')
        this.currentConcernsCustody = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA39')
        this.currentConcernsHostel = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA40')
        this.currentConcernsVulnerability = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA45')
        this.currentConcernsEscape = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA51')
        this.currentConcernsDisruptive = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA55')
        this.currentConcernsBreachOfTrust = common.getSingleAnswer(dbAssessment.qaData, 'ROSHFULL', 'FA58')
        this.analysisSuicideSelfharm = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA62')
        this.analysisCoping = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA63')
        this.analysisVulnerabilities = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA64')
        this.analysisEscapeAbscond = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA65')
        this.analysisControlBehaveTrust = common.getTextAnswer(dbAssessment.textData, 'ROSHFULL', 'FA66')

        if (dbAssessment.sanIndicator == 'Y') { // No SP data for SAN assessments
            delete this.initialSpDate
            delete this.reviewSpDate
            delete this.reviewNum
            delete this.basicSentencePlan
            delete this.sentencePlan
        } else {
            this.initialSpDate = common.getReformattedDateAnswer(dbAssessment.textData, 'ISP', 'IP.42')
            this.reviewSpDate = common.getReformattedDateAnswer(dbAssessment.textData, 'RSP', 'RP.54')
            this.reviewNum = common.getSingleAnswer(dbAssessment.textData, 'RSP', 'RP.1')

            if (this.initialSpDate == undefined) this.initialSpDate = null
            if (this.reviewSpDate == undefined) this.reviewSpDate = null
            if (this.reviewNum == undefined) this.reviewNum = null
        }

        this.weightedScores = new WeightedScores(dbAssessment)
        this.furtherInformation = new FurtherInformation(dbAssessment)
        this.newActuarialPredictors = new NewActuarialPredictors(dbAssessment.riskDetails, false)
        this.ogpOvp = new OgpOvp(dbAssessment)

        if (dbAssessment.sanIndicator != 'Y') {
            if (dbAssessment.basicSentencePlan.length > 0 && dbAssessment.assessmentVersion == 1) {
                this.basicSentencePlan = []
                dbAssessment.basicSentencePlan.forEach((objective) => { this.basicSentencePlan.push(new BasicSentencePlanArea(objective)) })
            }

            const filteredObjectives = dbAssessment.objectives.filter((objective) => objective.objectiveStatus != 'RI')
            if (filteredObjectives.length > 0) {
                this.sentencePlan = new SentencePlan(filteredObjectives)
            }
        }
        this.indicators = new Indicators(dbAssessment)

        const filteredOffences = dbAssessment.offences.filter((o) => o.type != 'PRINCIPAL_PROPOSAL')
        if (dbAssessment.offences.length > 0) {
            filteredOffences.forEach((offence) => this.offences.push(new Offence(offence)))
        } else if (dbAssessment.offences.length > 0) {
            this.offences = [{ offenceCode: null, offenceSubcode: null, additionalOffence: null }] // NOT SURE IF THIS IS CORRECT
        }
    }
}

class Offence {

    offenceCode: string
    offenceSubcode: string
    additionalOffence: string

    constructor(dbOffence: dbClasses.DbOffence) {

        this.offenceCode = dbOffence.offenceCode
        this.offenceSubcode = dbOffence.offenceSubCode
        this.additionalOffence = dbOffence.additionalOffence
    }
}

class WeightedScores {

    accommodationWeightedScore: number
    eteWeightedScore: number
    relationshipsWeightedScore: number
    lifestyleWeightedScore: number
    drugWeightedScore: number
    alcoholWeightedScore: number
    thinkingWeightedScore: number
    attitudesWeightedScore: number

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.accommodationWeightedScore = common.getSectionScore(dbAssessment, '3')
        this.eteWeightedScore = common.getSectionScore(dbAssessment, '4')
        this.relationshipsWeightedScore = common.getSectionScore(dbAssessment, '6')
        this.lifestyleWeightedScore = common.getSectionScore(dbAssessment, '7')
        this.drugWeightedScore = common.getSectionScore(dbAssessment, '8')
        this.alcoholWeightedScore = common.getSectionScore(dbAssessment, '9')
        this.thinkingWeightedScore = common.getSectionScore(dbAssessment, '11')
        this.attitudesWeightedScore = common.getSectionScore(dbAssessment, '12')
    }
}

class FurtherInformation {

    totWeightedScore: number
    pOAssessment: string
    pOAssessmentDesc: string
    assessorName: string
    ogrs1Year: number
    ogrs2Year: number
    reviewTerm: string
    cmsEventNumber: number
    courtCode: string
    courtType: string
    courtName: string
    rsrAlgorithmVersion: number

    constructor(dbAssessment: dbClasses.DbAssessment) {

        if (dbAssessment.riskDetails.ogpTotWesc == null || dbAssessment.riskDetails.ovpTotWesc == null) {
            this.totWeightedScore = null
        } else {
            this.totWeightedScore = dbAssessment.riskDetails.ogpTotWesc + dbAssessment.riskDetails.ovpTotWesc
        }

        this.pOAssessment = dbAssessment.pOAssessment
        this.pOAssessmentDesc = dbAssessment.pOAssessmentDesc ? dbAssessment.pOAssessmentDesc.substring(0, 50) : poaLookup[this.pOAssessment]

        this.assessorName = dbAssessment.assessorName
        this.ogrs1Year = dbAssessment.riskDetails.ogrs31Year
        this.ogrs2Year = dbAssessment.riskDetails.ogrs32Year

        const reviewType = common.getSingleAnswer(dbAssessment.qaData, 'RSP', 'RP.3')
        this.reviewTerm = reviewType == 'Termination' ? 'Y' : 'N'

        this.cmsEventNumber = dbAssessment.eventNumber
        this.courtCode = dbAssessment.courtCode
        this.courtType = dbAssessment.courtType
        this.courtName = dbAssessment.courtName
        if (this.courtCode == undefined) this.courtCode = null
        if (this.courtType == undefined) this.courtType = null
        if (this.courtName == undefined) this.courtName = null

        this.rsrAlgorithmVersion = dbAssessment.riskDetails.rsrAlgorithmVersion

    }
}

class OgpOvp {

    ogpNC: string
    ovpNC: string
    ogp1Year: Number
    ogp2Year: Number
    ovp1Year: Number
    ovp2Year: Number
    ogrs3RiskRecon: string
    ogpRisk: string
    ovpRisk: string

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.ogpNC = dbAssessment.riskDetails.ogp1Year == null ? 'Y' : 'N'
        this.ovpNC = dbAssessment.riskDetails.ovp1Year == null ? 'Y' : 'N'
        this.ogp1Year = dbAssessment.riskDetails.ogp1Year
        this.ogp2Year = dbAssessment.riskDetails.ogp2Year
        this.ovp1Year = dbAssessment.riskDetails.ovp1Year
        this.ovp2Year = dbAssessment.riskDetails.ovp2Year
        this.ogrs3RiskRecon = dbAssessment.riskDetails.ogrs3RiskRecon
        this.ogpRisk = dbAssessment.riskDetails.ogpRisk
        this.ovpRisk = dbAssessment.riskDetails.ovpRisk
    }
}

class Offender {

    riskToOthers: string
    offenderPk: number

    constructor(offender: dbClasses.DbOffenderWithAssessments) {

        this.riskToOthers = offender.riskToOthers
        this.offenderPk = offender.offenderPk
    }
}

class BasicSentencePlanArea {

    bspAreaLinked: string
    bspAreaLinkedDesc: string

    constructor(objective: dbClasses.DbBspObjective) {

        this.bspAreaLinked = objective.bspAreaLinked
        this.bspAreaLinkedDesc = objective.bspAreaLinkedDesc
    }
}

class SentencePlan {

    objectives: SentencePlanObjective[] = []

    constructor(objectives: dbClasses.DbObjective[]) {

        objectives.forEach((objective) => { this.objectives.push(new SentencePlanObjective(objective)) })
    }
}

class SentencePlanObjective {

    objectiveCode: string
    objectiveCodeDesc: string
    objectiveDesc: string
    objectiveStatus: string
    objectiveStatusDesc: string
    objectiveSequence: number

    criminogenicNeeds: CriminogenicNeed[] = []
    actions: SentencePlanAction[] = []

    constructor(dbObjective: dbClasses.DbObjective) {

        this.objectiveCode = dbObjective.objectiveCode
        this.objectiveCodeDesc = dbObjective.objectiveCodeDesc
        this.objectiveDesc = dbObjective.objectiveDesc
        this.objectiveStatus = dbObjective.objectiveStatus
        this.objectiveStatusDesc = dbObjective.objectiveStatusDesc
        this.objectiveSequence = dbObjective.objectiveSequence

        dbObjective.criminogenicNeeds.forEach((need) => { this.criminogenicNeeds.push(new CriminogenicNeed(need)) })
        dbObjective.actions.forEach((action) => { this.actions.push(new SentencePlanAction(action)) })
    }
}

class CriminogenicNeed {

    criminogenicNeed: string
    criminogenicNeedDesc: string

    constructor(needsData: dbClasses.DbNeed) {

        this.criminogenicNeed = needsData.criminogenicNeed
        this.criminogenicNeedDesc = needsData.criminogenicNeedDesc
    }

}

class SentencePlanAction {

    action: string
    actionDesc: string
    actionComment: string

    constructor(dbAction: dbClasses.DbAction) {

        this.action = dbAction.action
        this.actionDesc = dbAction.actionDesc
        this.actionComment = dbAction.actionComment?.substring(0, 250) || null
    }
}

class Indicators {

    sanIndicator: string

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.sanIndicator = dbAssessment.sanIndicator
    }
}

const poaLookup = {
    100: 'Bail',
    110: 'Bail-not guilty plea',
    120: 'PSR',
    130: 'PSR other offences committed',
    140: 'PSR Breach on original offences',
    150: 'Start Community Rehabilitation Order',
    160: 'Start Community Punishment Order',
    170: 'Start Community Punishment and Rehabilitation Order',
    180: 'Start hostel residence',
    190: 'Supervision plan review',
    200: 'Start licence - YOI',
    210: 'Start licence - ACR',
    220: 'Start licence - DCR',
    230: 'Start licence - Parole',
    240: 'Start licence - Non-Parole',
    250: 'Start licence - Life',
    260: 'Start custody',
    270: 'Review',
    280: 'HDC',
    290: 'ROTL',
    300: 'Parole',
    310: 'Home leave',
    320: 'Pre release',
    330: 'Termination of Community Supervision',
    340: 'End of licence',
    350: 'Transfer Out',
    360: 'Significant Change',
    370: 'Change - resulting from appeal',
    380: 'Remand/trial',
    390: 'Hostel Assessment',
    400: 'Other',
    410: 'Start Licence - pre-CJA 2003',
    420: 'Start DTTO',
    430: 'Start of Community Order',
    440: 'Start of Suspended Sentence Order',
    450: 'Start Licence',
    460: 'PSR Addendum',
    470: 'Deferred Sentence Report',
    480: 'Fast Review',
    490: 'Recall',
    500: 'Transfer in from YOT',
    510: 'Transfer in from non England / Wales Court',
    520: 'PSR - SDR',
    530: 'PSR - FDR',
    540: 'PSR - Oral',
    550: 'Start Community Sentence - pre-CJA 2003',
    560: 'Non-statutory',
    570: 'SSO Activated',
    580: 'Risk Review',
    590: 'Nil Report',
    600: 'Risk of Harm Assessment',
    610: 'TSP Assessment',
    620: 'RSR Only',
    630: 'RSR and Risk Assessment Only',
    640: 'Re-categorisation to Open Conditions',
    650: 'Pre-handover',
    660: 'Probation Reset Suspension',
    670: 'Impact Cohort Assessment',
}