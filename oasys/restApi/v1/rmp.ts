import * as v1Common from './v1Common'
import * as common from '../common'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const relevantAssessments = offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)))

    if (relevantAssessments.length == 0) {
        cy.wrap(offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'STANDALONE'].includes(ass.assessmentType))).length == 0
            ? env.restErrorResults.noAssessments : env.restErrorResults.noMatchingAssessments).as(resultAlias)
    } else {
        const result = new RmpEndpointResponse(offenderData, parameters)

        result.addTimeline(relevantAssessments)
        result.addRmpTimeline(relevantAssessments)
        result.addLatestAssessment(relevantAssessments)

        cy.wrap(result).as(resultAlias)
    }
}


export class RmpEndpointResponse extends v1Common.V1EndpointResponse {

    rmpTimeline: v1Common.TimelineAssessment[]
    assessments: RMPAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addRmpTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[]) {

        for (let i = 0; i < dbAssessments.length; i++) {
            const assessment = dbAssessments[i] as dbClasses.DbAssessment
            if (['M', 'H', 'V'].includes(assessment.roshLevel)) {

                if (assessment.textData.filter((q) => q[0] == 'RMP' && ['RM28', 'RM28.1', 'RM30', 'RM31', 'RM32', 'RM33', 'RM34'].includes(q[1])).length > 0) {
                    if (this.rmpTimeline == undefined) {
                        this.rmpTimeline = []
                    }
                    this.rmpTimeline.push(new v1Common.TimelineAssessment(dbAssessments[i]))

                }
            }
        }
    }

    addLatestAssessment(dbAssessments: dbClasses.DbAssessmentOrRsr[]): number {

        const assessmentIndex = super.addLatestAssessment(dbAssessments, RMPAssessment, false)

        if (assessmentIndex >= 0) {
            this.assessments[0].addRmpDetails(dbAssessments[assessmentIndex] as dbClasses.DbAssessment)
        }

        return assessmentIndex
    }
}

class RMPAssessment extends v1Common.V1AssessmentCommon {

    keyInformationCurrentSituation: string = null
    furtherConsiderationsCurrentSituation: string = null
    supervision: string = null
    monitoringAndControl: string = null
    interventionsAndTreatment: string = null
    victimSafetyPlanning: string = null
    contingencyPlans: string = null


    addRmpDetails(assessment: dbClasses.DbAssessment) {

        if (['M', 'H', 'V'].includes(assessment.roshLevel)) {
            this.keyInformationCurrentSituation = common.getTextAnswer(assessment.textData, 'RMP', 'RM28.1')
            this.furtherConsiderationsCurrentSituation = common.getTextAnswer(assessment.textData, 'RMP', 'RM28')
            this.supervision = common.getTextAnswer(assessment.textData, 'RMP', 'RM30')
            this.monitoringAndControl = common.getTextAnswer(assessment.textData, 'RMP', 'RM31')
            this.interventionsAndTreatment = common.getTextAnswer(assessment.textData, 'RMP', 'RM32')
            this.victimSafetyPlanning = common.getTextAnswer(assessment.textData, 'RMP', 'RM33')
            this.contingencyPlans = common.getTextAnswer(assessment.textData, 'RMP', 'RM34')
        }
    }
}


export class OffenceDetails {

    type: string
    offenceDate?: string
    offenceCode: string
    offenceSubCode: string
    offence: string
    subOffence: string

    constructor(dbOffence: dbClasses.DbOffence) {

        this.type = dbOffence.type
        if (dbOffence.offenceDate != undefined) this.offenceDate = dbOffence.offenceDate
        this.offenceCode = dbOffence.offenceCode
        this.offenceSubCode = dbOffence.offenceSubCode
        this.offence = dbOffence.offence
        this.subOffence = dbOffence.subOffence
    }
}

export class VictimDetails {

    age: string
    gender: string
    ethnicCategory: string
    victimRelation: string

    constructor(dbVictim: dbClasses.DbVictim) {

        this.age = dbVictim.age
        this.gender = dbVictim.gender
        this.ethnicCategory = dbVictim.ethnicCategory
        this.victimRelation = dbVictim.victimRelation
    }
}