import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from 'restApi/dbClasses'
import * as env from 'environments'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, resultAlias: string) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        cy.wrap(env.restErrorResults.noAssessments).as(resultAlias)

    } else {
        const result = new Section4EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        cy.wrap(result).as(resultAlias)
    }
}

export class Section4EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section4Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section4Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section4Assessment extends v4Common.V4AssessmentCommon {

    unemployed: string
    problemAreas: string[]
    initSkillsCheckerScore: string
    employmentHistory: string
    workRelatedSkills: string
    attitudeToEmployment: string
    schoolAttendance: string
    problemsReadWriteNum: string
    learningDifficulties: string
    qualifications: string
    attitudeToEducationTraining: string
    basicSkillsScore: string
    eTEIssuesDetails: string
    eTELinkedToHarm: string
    eTELinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.unemployed = common.getSingleAnswer(dbAssessment.qaData, '4', '4.2')
        this.problemAreas = common.getMultipleAnswers(dbAssessment.qaData, '4', ['4.7.1'], 2)
        this.initSkillsCheckerScore = common.getSingleAnswer(dbAssessment.qaData, '4', '4.92')
        this.employmentHistory = common.getSingleAnswer(dbAssessment.qaData, '4', '4.3')
        this.workRelatedSkills = common.getSingleAnswer(dbAssessment.qaData, '4', '4.4')
        this.attitudeToEmployment = common.getSingleAnswer(dbAssessment.qaData, '4', '4.5')
        this.schoolAttendance = common.getSingleAnswer(dbAssessment.qaData, '4', '4.6')
        this.problemsReadWriteNum = common.getSingleAnswer(dbAssessment.qaData, '4', '4.7')
        this.learningDifficulties = common.getSingleAnswer(dbAssessment.qaData, '4', '4.8')
        this.qualifications = common.getSingleAnswer(dbAssessment.qaData, '4', '4.9')
        this.attitudeToEducationTraining = common.getSingleAnswer(dbAssessment.qaData, '4', '4.10')
        this.basicSkillsScore = common.getSingleAnswer(dbAssessment.qaData, '4', '4.90')
        this.eTEIssuesDetails = common.getTextAnswer(dbAssessment.textData, '4', '4.94')
        this.eTELinkedToHarm = common.getSingleAnswer(dbAssessment.qaData, '4', '4.96')
        this.eTELinkedToReoffending = common.getSingleAnswer(dbAssessment.qaData, '4', '4.98')

    }
}
