import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section2EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section2EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section2Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section2Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section2Assessment extends v4Common.V4AssessmentCommon {

    victimPerpetratorRel: string
    offenceAnalysis: string
    involveCarryingWeapon: string
    victimInfo: string
    sexual: string
    whichWeapon: string
    acceptsResponsibility: string
    whatWasInvolved: string[] = null  //////////////// should be removed?
    typeOfWeapon: string = null  //////////////// should be removed?
    involveViolenceOrThreat: string
    otherMotivationText: string
    financial: string
    involveExcessiveViolence: string
    whatOccurred: string[]
    addictions: string
    involveArson: string
    emotional: string
    involvePhysicalDamage: string
    victimImpact: string
    racial: string
    involveSexualElement: string
    recognisesImpact: string
    thrillSeeking: string
    involveDomesticAbuse: string
    otherInvolved: string
    other: string
    numberOfOthersInvolved: string
    peerGroupInfluences: string
    othersInvolved: string
    offenceMotivation: string
    disinhibitors: string[]
    acceptsResponsibilityYesNo: string
    patternOffending: string
    escalationOfSeriousness: string
    partOfEstablishedPattern: string
    offenceLinkedToReoffending: string
    offenceLinkedToHarm: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.victimPerpetratorRel = common.getTextAnswer(dbAssessment.textData, '2', '2.4.2')
        this.offenceAnalysis = common.getTextAnswer(dbAssessment.textData, '2', '2.1')
        this.victimInfo = common.getTextAnswer(dbAssessment.textData, '2', '2.4.1')
        this.acceptsResponsibility = common.getTextAnswer(dbAssessment.textData, '2', '2.11.t')
        this.whatOccurred = common.getMultipleAnswers(dbAssessment.qaData, '2', ['2.3'], 2)
        this.victimImpact = common.getTextAnswer(dbAssessment.textData, '2', '2.5')
        this.recognisesImpact = common.getSingleAnswer(dbAssessment.qaData, '2', '2.6')
        this.otherInvolved = common.getSingleAnswer(dbAssessment.qaData, '2', '2.7')
        this.numberOfOthersInvolved = common.getSingleAnswer(dbAssessment.qaData, '2', '2.7.1')
        this.peerGroupInfluences = common.getSingleAnswer(dbAssessment.qaData, '2', '2.7.2')
        this.othersInvolved = common.getTextAnswer(dbAssessment.textData, '2', '2.7.3')
        this.offenceMotivation = common.getTextAnswer(dbAssessment.textData, '2', '2.8')
        this.disinhibitors = common.getMultipleAnswers(dbAssessment.qaData, '2', ['2.10'], 2)
        this.acceptsResponsibilityYesNo = common.getSingleAnswer(dbAssessment.qaData, '2', '2.11')
        this.patternOffending = common.getTextAnswer(dbAssessment.textData, '2', '2.12')
        this.escalationOfSeriousness = common.getSingleAnswer(dbAssessment.qaData, '2', '2.13')
        this.partOfEstablishedPattern = common.getSingleAnswer(dbAssessment.qaData, '2', '2.14')
        this.offenceLinkedToReoffending = common.getTextAnswer(dbAssessment.textData, '2', '2.98')
        this.offenceLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '2', '2.99')

        if (dbAssessment.initiationDate > common.releaseDate6_35) {
            this.involveCarryingWeapon = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_WEAPON')
            this.involveViolenceOrThreat = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_ANYVIOL')
            this.involveExcessiveViolence = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_EXCESSIVE')
            this.involveArson = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_ARSON')
            this.involvePhysicalDamage = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_PHYSICALDAM')
            this.involveSexualElement = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_SEXUAL')
            this.involveDomesticAbuse = common.getSingleAnswer(dbAssessment.qaData, '2', '2.2_V2_DOM_ABUSE')
            this.whichWeapon = common.getTextAnswer(dbAssessment.textData, '2', '2.2.t_V2')
        } else {
            const whatWasInvolved = common.getMultipleAnswers(dbAssessment.qaData, '2', ['2.2'], 2)
            if (whatWasInvolved != null && whatWasInvolved != undefined) {
                this.involveCarryingWeapon = whatWasInvolved.includes('Carrying or using a weapon') ? 'Yes' : null
                this.involveViolenceOrThreat = whatWasInvolved.includes('Any violence or threat of violence / coercion') ? 'Yes' : null
                this.involveExcessiveViolence = whatWasInvolved.includes('Excessive use of violence / sadistic violence') ? 'Yes' : null
                this.involveArson = whatWasInvolved.includes('Arson') ? 'Yes' : null
                this.involvePhysicalDamage = whatWasInvolved.includes('Physical damage to property') ? 'Yes' : null
                this.involveSexualElement = whatWasInvolved.includes('Sexual element') ? 'Yes' : null
                this.involveDomesticAbuse = whatWasInvolved.includes('Domestic abuse') ? 'Yes' : null
            } else {
                this.involveCarryingWeapon = null
                this.involveViolenceOrThreat = null
                this.involveExcessiveViolence = null
                this.involveArson = null
                this.involvePhysicalDamage = null
                this.involveSexualElement = null
                this.involveDomesticAbuse = null
            }
            this.whichWeapon = common.getTextAnswer(dbAssessment.textData, '2', '2.2.t')
        }

        if (dbAssessment.initiationDate > common.releaseDate6_35) {
            this.sexual = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_SEXUAL')
            this.financial = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_FINANCIAL')
            this.addictions = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_ADDICTION')
            this.emotional = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_EMOTIONAL')
            this.racial = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_RACIAL')
            this.thrillSeeking = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_THRILL')
            this.other = common.getSingleAnswer(dbAssessment.qaData, '2', '2.9_V2_OTHER')
            this.otherMotivationText = common.getTextAnswer(dbAssessment.textData, '2', '2.9.t_V2')
        } else {
            const offenceInvolved = common.getMultipleAnswers(dbAssessment.qaData, '2', ['2.9'], 2)
            if (offenceInvolved != null && offenceInvolved != undefined) {
                this.sexual = offenceInvolved.includes('Sexual motivation') ? 'Yes' : null
                this.financial = offenceInvolved.includes('Financial motivation') ? 'Yes' : null
                this.addictions = offenceInvolved.includes('Addiction / perceived needs') ? 'Yes' : null
                this.emotional = offenceInvolved.includes('Emotional state of offender') ? 'Yes' : null
                this.racial = offenceInvolved.includes('Racial motivation or hatred of other identifiable group') ? 'Yes' : null
                this.thrillSeeking = offenceInvolved.includes('Thrill seeking') ? 'Yes' : null
                this.other = offenceInvolved.includes('Other') ? 'Yes' : null
            } else {
                this.sexual = null
                this.financial = null
                this.addictions = null
                this.emotional = null
                this.racial = null
                this.thrillSeeking = null
                this.other = null
            }
            this.otherMotivationText = common.getTextAnswer(dbAssessment.textData, '2', '2.9.t')
        }
    }
}
