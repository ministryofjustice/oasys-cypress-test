import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        cy.wrap(env.restErrorResults.noAssessments).as(resultAlias)

    } else {
        const result = new Section13EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        cy.wrap(result).as(resultAlias)
    }
}

export class Section13EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section13Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section13Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section13Assessment extends v4Common.V4AssessmentCommon {

    generalHealth: string
    tickHealthCommunity: string
    healthCommunity: string
    tickLifestyleCommunity: string
    tickReligiousCommunity: string
    tickTransportCommunity: string
    tickEmploymentCommunity: string
    tickEducationCommunity: string
    tickChildCareCommunity: string
    tickDisabilityCommunity: string
    tickPsychiatricCommunity: string
    tickMotivationCommunity: string
    tickLearningCommunity: string
    tickLiteracyCommunity: string
    tickCommunicationCommunity: string
    tickInterpreterCommunity: string
    tickAlcoholCommunity: string
    generalHeathSpecify: string
    elecMonSpecify: string
    tickHealthEM: string
    healthEM: string
    drugsCommunity: string
    tickDrugsEM: string
    drugsEM: string
    drugsProgramme: string
    lifestyleCommunity: string
    tickLifestyleEM: string
    lifestyleEM: string
    lifestyleProgramme: string
    religiousCommunity: string
    tickReligiousEM: string
    religiousEM: string
    religiousProgramme: string
    transportCommunity: string
    tickTransportEM: string
    transportEM: string
    transportProgramme: string
    employmentCommunity: string
    tickEmploymentEM: string
    employmentEM: string
    employmentProgramme: string
    educationCommunity: string
    tickEducationEM: string
    educationEM: string
    educationProgramme: string
    childCareCommunity: string
    tickChildCareEM: string
    childCareEM: string
    childCareProgramme: string
    disabilityCommunity: string
    tickDisabilityEM: string
    disabilityEM: string
    disabilityProgramme: string
    psychiatricCommunity: string
    tickPsychiatricEM: string
    psychiatricEM: string
    psychiatricProgramme: string
    motivationCommunity: string
    tickMotivationEM: string
    motivationEM: string
    motivationProgramme: string
    learningCommunity: string
    tickLearningEM: string
    learningEM: string
    learningProgramme: string
    literacyCommunity: string
    tickLiteracyEM: string
    literacyEM: string
    literacyProgramme: string
    communicationCommunity: string
    tickCommunicationEM: string
    communicationEM: string
    communicationProgramme: string
    interpreterCommunity: string
    tickInterpreterEM: string
    interpreterEM: string
    interpreterProgramme: string
    alcoholCommunity: string
    tickAlcoholEM: string
    alcoholEM: string
    alcoholProgramme: string
    tickHealthProgramme: string
    healthProgramme: string
    tickDrugsProgramme: string
    tickLifestyleProgramme: string
    tickReligiousProgramme: string
    tickTransportProgramme: string
    tickEmploymentProgramme: string
    tickEducationProgramme: string
    tickChildCareProgramme: string
    tickDisabilityProgramme: string
    tickPsychiatricProgramme: string
    tickMotivationProgramme: string
    tickLearningProgramme: string
    tickLiteracyProgramme: string
    tickCommunicationProgramme: string
    tickInterpreterProgramme: string
    tickalcoholProgramme: string
    elecMon: string
    elecMonAdverseImpact: string
    elecMonElectricity: string
    understandsImportanceOfCompletingProgramme: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.generalHealth = common.getSingleAnswer(dbAssessment.qaData, '13', '13.1')
        this.tickHealthCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.1.1', dictionary)
        this.healthCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.1.1.t')
        this.tickLifestyleCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.11.1', dictionary)
        this.tickReligiousCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.12.1', dictionary)
        this.tickTransportCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.13.1', dictionary)
        this.tickEmploymentCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.14.1', dictionary)
        this.tickEducationCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.15.1', dictionary)
        this.tickChildCareCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.16.1', dictionary)
        this.tickDisabilityCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.2.1', dictionary)
        this.tickPsychiatricCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.3.1', dictionary)
        this.tickMotivationCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.4.1', dictionary)
        this.tickLearningCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.5.1', dictionary)
        this.tickLiteracyCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.6.1', dictionary)
        this.tickCommunicationCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.7.1', dictionary)
        this.tickInterpreterCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.8.1', dictionary)
        this.tickAlcoholCommunity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.9.1', dictionary)
        this.generalHeathSpecify = common.getTextAnswer(dbAssessment.textData, '13', '13.1.t')
        this.elecMonSpecify = common.getTextAnswer(dbAssessment.textData, '13', '13.2.t')
        this.tickHealthEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.1.2', dictionary)
        this.healthEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.1.2.t')
        this.drugsCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.10.1.t')
        this.tickDrugsEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.10.2', dictionary)
        this.drugsEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.10.2.t')
        this.drugsProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.10.3.t')
        this.lifestyleCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.11.1.t')
        this.tickLifestyleEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.11.2', dictionary)
        this.lifestyleEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.11.2.t')
        this.lifestyleProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.11.3.t')
        this.religiousCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.12.1.t')
        this.tickReligiousEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.12.2', dictionary)
        this.religiousEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.12.2.t')
        this.religiousProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.12.3.t')
        this.transportCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.13.1.t')
        this.tickTransportEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.13.2', dictionary)
        this.transportEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.13.2.t')
        this.transportProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.13.3.t')
        this.employmentCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.14.1.t')
        this.tickEmploymentEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.14.2', dictionary)
        this.employmentEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.14.2.t')
        this.employmentProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.14.3.t')
        this.educationCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.15.1.t')
        this.tickEducationEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.15.2', dictionary)
        this.educationEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.15.2.t')
        this.educationProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.15.3.t')
        this.childCareCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.16.1.t')
        this.tickChildCareEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.16.2', dictionary)
        this.childCareEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.16.2.t')
        this.childCareProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.16.3.t')
        this.disabilityCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.2.1.t')
        this.tickDisabilityEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.2.2', dictionary)
        this.disabilityEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.2.2.t')
        this.disabilityProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.2.3.t')
        this.psychiatricCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.3.1.t')
        this.tickPsychiatricEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.3.2', dictionary)
        this.psychiatricEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.3.2.t')
        this.psychiatricProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.3.3.t')
        this.motivationCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.4.1.t')
        this.tickMotivationEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.4.2', dictionary)
        this.motivationEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.4.2.t')
        this.motivationProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.4.3.t')
        this.learningCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.5.1.t')
        this.tickLearningEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.5.2', dictionary)
        this.learningEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.5.2.t')
        this.learningProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.5.3.t')
        this.literacyCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.6.1.t')
        this.tickLiteracyEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.6.2', dictionary)
        this.literacyEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.6.2.t')
        this.literacyProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.6.3.t')
        this.communicationCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.7.1.t')
        this.tickCommunicationEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.7.2', dictionary)
        this.communicationEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.7.2.t')
        this.communicationProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.7.3.t')
        this.interpreterCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.8.1.t')
        this.tickInterpreterEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.8.2', dictionary)
        this.interpreterEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.8.2.t')
        this.interpreterProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.8.3.t')
        this.alcoholCommunity = common.getTextAnswer(dbAssessment.textData, '13', '13.3.9.1.t')
        this.tickAlcoholEM = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.9.2', dictionary)
        this.alcoholEM = common.getTextAnswer(dbAssessment.textData, '13', '13.3.9.2.t')
        this.alcoholProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.9.3.t')
        this.tickHealthProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.1.3', dictionary)
        this.healthProgramme = common.getTextAnswer(dbAssessment.textData, '13', '13.3.1.3.t')
        this.tickDrugsProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.10.3', dictionary)
        this.tickLifestyleProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.11.3', dictionary)
        this.tickReligiousProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.12.3', dictionary)
        this.tickTransportProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.13.3', dictionary)
        this.tickEmploymentProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.14.3', dictionary)
        this.tickEducationProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.15.3', dictionary)
        this.tickChildCareProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.16.3', dictionary)
        this.tickDisabilityProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.2.3', dictionary)
        this.tickPsychiatricProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.3.3', dictionary)
        this.tickMotivationProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.4.3', dictionary)
        this.tickLearningProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.5.3', dictionary)
        this.tickLiteracyProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.6.3', dictionary)
        this.tickCommunicationProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.7.3', dictionary)
        this.tickInterpreterProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.8.3', dictionary)
        this.tickalcoholProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.3.9.3', dictionary)
        this.elecMon = common.getSingleAnswer(dbAssessment.qaData, '13', '13.2')
        this.elecMonAdverseImpact = common.getSingleAnswer(dbAssessment.qaData, '13', '13.2.1')
        this.elecMonElectricity = common.getSingleAnswer(dbAssessment.qaData, '13', '13.2.2')
        this.understandsImportanceOfCompletingProgramme = common.getSingleAnswer(dbAssessment.qaData, '13', '13.4')

    }
}


const dictionary = {
    'Check if issue': 'Yes',
}