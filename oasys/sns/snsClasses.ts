import { DbAssessmentOrRsr } from "./dbClasses"

/**
 * This module contains a top-level class for the SnsMessages, plus a MessageData class for each message type.
 * The MessageData classes extend SnsMessageData, which covers the common message content.
 */
export class SnsMessage {

    messageType: SnsMessageType
    messageData: SnsMessageData
    messageSubject: string

    constructor(assessment: DbAssessmentOrRsr, crn: string, messageType: SnsMessageType) {

        this.messageType = messageType

        switch (messageType) {
            case 'AssSumm':
                this.messageData = new AssSummMessageData(assessment, crn)
                break
            case 'OGRS':
                this.messageData = new OgrsMessageData(assessment, crn)
                break
            case 'OPD':
                this.messageData = new OpdMessageData(assessment, crn)
                break
            case 'RSR':
                this.messageData = new RsrMessageData(assessment, crn)
                break
        }
        this.messageSubject = this.messageData.eventType
    }
}

export class SnsMessageData {

    eventType = ''
    version = 1
    description = ''
    detailUrl = 'https://some-url-where-we-can-get-more-info-this-might-not-exist'
    occurredAt = ''  // Not tested, difficult to predict exact time of this

    additionalInformation: object
    personReference = { identifiers: [{ type: 'CRN', value: '' }] }

    constructor(crn: string) {

        this.personReference.identifiers[0].value = crn
    }
}

export class AssSummMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'assessment.summary.produced'
        this.description = 'Assessment Summary has been produced'
        cy.log(JSON.stringify(assessment))
        const endPoint = assessment.sanIndicator == 'Y' ? 'asssummsan' : 'asssumm'
        this.detailUrl = `https://ords.justice.gov.uk/ords/${endPoint}/${crn}/ALLOW/${assessment.pk}/${assessment.status}`
    }
}

export class OgrsMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'risk-assessment.scores.ogrs.determined'
        this.description = 'Risk assessment scores have been determined'

        this.additionalInformation = {
            OGRS3Yr1: assessment.ogrs1yr,
            OGRS3Yr2: assessment.ogrs2yr,
            EventNumber: assessment.eventNumber,
            AssessmentDate: assessment.assessmentDate
        }
    }
}


export class OpdMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'opd.produced'
        this.description = 'OPD has been produced'
        delete this.detailUrl
        this.personReference.identifiers.push({ 'type': 'nomisId', value: '' })

        this.additionalInformation = {
            dateCompleted: assessment.completedDate,
            opdResult: assessment.opdResult,
            opdScreenOutOverride: assessment.opdOverride
        }
    }
}

export class RsrMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'risk-assessment.scores.rsr.determined'
        this.description = 'Risk assessment scores have been determined'

        this.additionalInformation = {
            RSRScore: assessment.rsrScore,
            RSRBand: assessment.rsrBand,
            RSRStaticOrDynamic: assessment.rsrStaticDynamic,
            OSPIndecentScore: assessment.ospIndecentScore,
            OSPIndecentBand: assessment.ospIndecentBand,
            OSPContactScore: assessment.ospContactScore,
            OSPContactBand: assessment.ospContactBand,
            OSPIndirectIndecentScore: assessment.ospIicScore,
            OSPIndirectIndecentBand: assessment.ospIicBand,
            OSPDirectContactScore: assessment.ospDcScore,
            OSPDirectContactBand: assessment.ospDcBand,
            EventNumber: assessment.eventNumber,
            AssessmentDate: assessment.assessmentDate
        }
    }
}

