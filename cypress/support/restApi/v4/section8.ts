import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from '../dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section8EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section8EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section8Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section8Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section8Assessment extends v4Common.V4AssessmentCommon {

    drugsEverMisused: string
    heroinCurrentUsage: string
    ecstasyCurrentUsage: string
    cannabisCurrentUsage: string
    solventsCurrentUsage: string
    steroidsCurrentUsage: string
    spiceCurrentUsage: string
    otherCurrentUsage: string
    methadoneCurrentUsage: string
    otherOpiatesCurrentUsage: string
    crackCocaineCurrentUsage: string
    cocaineHydrochlorideCurrentUsage: string
    misusedPrescribedDrugsCurrentUsage: string
    benzodiazepinesCurrentUsage: string
    amphetaminesCurrentUsage: string
    hallucinogensCurrentUsage: string
    heroinCurrentInject: string
    steroidsCurrentInject: string
    otherCurrentInject: string
    methadoneCurrentInject: string
    otherOpiatesCurrentInject: string
    crackCocaineCurrentInject: string
    cocaineHydrochlorideCurrentInject: string
    misusedPrescribedDrugsCurrentInject: string
    benzodiazepinesCurrentInject: string
    amphetaminesCurrentInject: string
    heroinPreviousUsage: string
    ecstasyPreviousUsage: string
    cannabisPreviousUsage: string
    solventsPreviousUsage: string
    steroidsPreviousUsage: string
    spicePreviousUsage: string
    otherPreviousUsage: string
    methadonePreviousUsage: string
    otherOpiatesPreviousUsage: string
    crackCocainePreviousUsage: string
    cocaineHydrochloridePreviousUsage: string
    misusedPrescribedDrugsPreviousUsage: string
    benzodiazepinesPreviousUsage: string
    amphetaminesPreviousUsage: string
    hallucinogensPreviousUsage: string
    heroinPreviousInject: string
    steroidsPreviousInject: string
    otherPreviousInject: string
    methadonePreviousInject: string
    otherOpiatesPreviousInject: string
    crackCocainePreviousInject: string
    cocaineHydrochloridePreviousInject: string
    misusedPrescribedDrugsPreviousInject: string
    benzodiazepinesPreviousInject: string
    amphetaminesPreviousInject: string
    currentDrugNoted: string
    LevelOfUseOfMainDrug: string
    everInjectedDrugs: string
    motivationToTackleDrugMisuse: string
    DrugsMajorActivity: string
    otherDrugs: string
    drugIssuesDetails: string
    drugLinkedToHarm: string
    drugLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.drugsEverMisused = common.getSingleAnswer(dbAssessment.qaData, '8', '8.1')
        this.heroinCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.1.1', dictionary)
        this.ecstasyCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.10.1', dictionary)
        this.cannabisCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.11.1', dictionary)
        this.solventsCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.12.1', dictionary)
        this.steroidsCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.13.1', dictionary)
        this.spiceCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.15.1', dictionary)
        this.otherCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.14.1', dictionary)
        this.methadoneCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.2.1', dictionary)
        this.otherOpiatesCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.3.1', dictionary)
        this.crackCocaineCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.4.1', dictionary)
        this.cocaineHydrochlorideCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.5.1', dictionary)
        this.misusedPrescribedDrugsCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.6.1', dictionary)
        this.benzodiazepinesCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.7.1', dictionary)
        this.amphetaminesCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.8.1', dictionary)
        this.hallucinogensCurrentUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.9.1', dictionary)
        this.heroinCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.1.2', dictionary)
        this.steroidsCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.13.2', dictionary)
        this.otherCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.14.2', dictionary)
        this.methadoneCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.2.2', dictionary)
        this.otherOpiatesCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.3.2', dictionary)
        this.crackCocaineCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.4.2', dictionary)
        this.cocaineHydrochlorideCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.5.2', dictionary)
        this.misusedPrescribedDrugsCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.6.2', dictionary)
        this.benzodiazepinesCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.7.2', dictionary)
        this.amphetaminesCurrentInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.8.2', dictionary)
        this.heroinPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.1.3', dictionary)
        this.ecstasyPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.10.3', dictionary)
        this.cannabisPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.11.3', dictionary)
        this.solventsPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.12.3', dictionary)
        this.steroidsPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.13.3', dictionary)
        this.spicePreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.15.3', dictionary)
        this.otherPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.14.3', dictionary)
        this.methadonePreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.2.3', dictionary)
        this.otherOpiatesPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.3.3', dictionary)
        this.crackCocainePreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.4.3', dictionary)
        this.cocaineHydrochloridePreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.5.3', dictionary)
        this.misusedPrescribedDrugsPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.6.3', dictionary)
        this.benzodiazepinesPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.7.3', dictionary)
        this.amphetaminesPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.8.3', dictionary)
        this.hallucinogensPreviousUsage = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.9.3', dictionary)
        this.heroinPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.1.4', dictionary)
        this.steroidsPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.13.4', dictionary)
        this.otherPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.14.4', dictionary)
        this.methadonePreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.2.4', dictionary)
        this.otherOpiatesPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.3.4', dictionary)
        this.crackCocainePreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.4.4', dictionary)
        this.cocaineHydrochloridePreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.5.4', dictionary)
        this.misusedPrescribedDrugsPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.6.4', dictionary)
        this.benzodiazepinesPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.7.4', dictionary)
        this.amphetaminesPreviousInject = common.getSingleAnswer(dbAssessment.qaData, '8', '8.2.8.4', dictionary)
        this.currentDrugNoted = common.getSingleAnswer(dbAssessment.qaData, '8', '8.4')
        this.LevelOfUseOfMainDrug = common.getSingleAnswer(dbAssessment.qaData, '8', '8.5')
        this.everInjectedDrugs = common.getSingleAnswer(dbAssessment.qaData, '8', '8.6', dictionary)
        this.motivationToTackleDrugMisuse = common.getSingleAnswer(dbAssessment.qaData, '8', '8.8')
        this.DrugsMajorActivity = common.getSingleAnswer(dbAssessment.qaData, '8', '8.9')
        this.otherDrugs = common.getTextAnswer(dbAssessment.textData, '8', '8.2.14.t')
        this.drugIssuesDetails = common.getTextAnswer(dbAssessment.textData, '8', '8.97')
        this.drugLinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '8', '8.98')
        this.drugLinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '8', '8.99')
    }
}


const dictionary = {
    'Check if injecting': 'Yes',
    'Check if previously injecting': 'Yes',
    'Check if using': 'Yes',
    'Check if previously using': 'Yes',
}