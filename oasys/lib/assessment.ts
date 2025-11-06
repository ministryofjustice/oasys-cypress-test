/**
 * __oasys.Assessment.*function*__  
 * 
 * Functions for creating assessments and lock incomplete.
 * @module Assessment
 */

import * as oasys from 'oasys'
import { IPage } from 'classes/page'
import { User } from 'classes/user'

/**
 * Create a probation assessment with the details provided for the Create Assessment page. Assumes you are starting on the Offender Details page.
 * 
 * The first parameter is an Assessment type object which must include purposeOfAssessment, others can be omitted to use the default values. Properties available:
 *  - purposeOfAssessment: PurposeOfAssessment
 *  - otherPleaseSpecify?: string
 *  - assessmentLayer?: AssessmentLayer
 *  - sentencePlanType?: string
 *  - includeCourtReportTemplate?: string
 *  - includeSanSections?: YesNoAnswer
 *  - selectTeam?: string
 *  - selectAssessor?: string
 *
 * The second (Yes/No) parameter should be supplied if you are expecting the option to clone from a historic assessment.
 */
export function createProb(assessmentDetails: CreateAssessmentDetails, clonePreviousHistoric?: 'Yes' | 'No') {

    getToCreateAssessmentPage(true)

    let createAssessmentPage = new oasys.Pages.Assessment.CreateAssessment()
    createAssessmentPage.setValues(assessmentDetails, true)
    createAssessmentPage.create.click()
    if (clonePreviousHistoric) {
        oasys.Nav.clickButton(clonePreviousHistoric)
    }

    cy.log(`Created assessment: ${JSON.stringify(assessmentDetails)}`)
}

/**
 * Create a prison assessment with the details provided for the Create Assessment page. Assumes you are starting on the Offender Details page.
 * 
 * The first parameter is an Assessment type object which must include purposeOfAssessment, others can be omitted to use the default values. Properties available:
 *  - purposeOfAssessment: PurposeOfAssessment
 *  - otherPleaseSpecify?: string
 *  - assessmentLayer?: AssessmentLayer
 *  - sentencePlanType?: string
 *  - includeCourtReportTemplate?: string
 *  - includeSanSections?: YesNoAnswer
 *  - selectTeam?: string
 *  - selectAssessor?: string
 *
 * The second (Yes/No) parameter should be supplied if you are expecting the option to clone from a historic assessment.
 */
export function createPris(assessmentDetails: CreateAssessmentDetails) {

    new oasys.Pages.Offender.OffenderDetails().createAssessment.click()

    let createAssessmentPage = new oasys.Pages.Assessment.CreateAssessment()
    createAssessmentPage.setValues(assessmentDetails, true)
    createAssessmentPage.create.click()
    cy.log(`Created assessment: ${JSON.stringify(assessmentDetails)}`)
}

/**
 * Go from the offender details page through CMS screens to the create assessment page for a probation offender.
 */
export function getToCreateAssessmentPage(suppressLog: boolean = false) {

    new oasys.Pages.Offender.OffenderDetails().createAssessment.click()
    new oasys.Pages.Offender.CrnAmendment().ok.click()
    new oasys.Pages.Offender.CmsSearchResults().cmsEventNumberColumn.clickFirstRow()
    new oasys.Pages.Offender.CmsOffenderDetails().updateOffender.click()

    if (!suppressLog) cy.log('Navigated to CreateAssessment page')
}

/**
 * Select any existing assessments and delete them.  Assumes you have the appropriate rights and are on the OffenderDetails page with the assessments tab visible.
 */
export function deleteAll(surname: string, forename: string) {

    const tab = new oasys.Pages.Offender.AssessmentsTab()
    const deleteAssessment = new oasys.Pages.Assessment.Other.DeleteAssessment()

    tab.assessments.purposeOfAssessment.getCount('count')
    cy.get<number>('@count').then((count) => {
        for (let i = 0; i < count; i++) {
            tab.assessments.purposeOfAssessment.clickFirstRow()
            deleteAssessment.goto(true)
            deleteAssessment.reasonForDeletion.setValue('Testing')
            deleteAssessment.ok.click()
            oasys.Nav.history(surname, forename)
        }
        cy.log(`Deleted ${count} assessment(s)`)
    })
}

/**
 * Delete the most recent assessment.  Assumes you have the appropriate rights and are on the OffenderDetails page with the assessments tab visible.
 */
export function deleteLatest() {

    const tab = new oasys.Pages.Offender.AssessmentsTab()
    const deleteAssessment = new oasys.Pages.Assessment.Other.DeleteAssessment()

    tab.assessments.purposeOfAssessment.clickFirstRow()
    deleteAssessment.goto(true)
    deleteAssessment.reasonForDeletion.setValue('Testing')
    deleteAssessment.ok.click()

    cy.log(`Deleted latest assessment`)
}

/**
 * Checks that the given OASYS_SET pk is deleted (i.e. deleted_date is not null)
 */
export function checkDeleted(pk: number) {

    checkIfDeleted(pk, true)
}

/**
 * Checks that the given OASYS_SET pk is NOT deleted (i.e. deleted_date is null)
 */
export function checkNotDeleted(pk: number) {

    checkIfDeleted(pk, false)
}

function checkIfDeleted(pk: number, expectDeleted: boolean) {

    oasys.Db.getData(`select deleted_date from eor.oasys_set where oasys_set_pk = ${pk}`, 'data')
    cy.get<string[][]>('@data').then((data) => {
        if (expectDeleted) {
            expect(data[0][0]).to.not.be.null
            cy.log(`Checked that assessment ${pk} has been deleted`)
        } else {
            expect(data[0][0]).to.be.null
            cy.log(`Checked that assessment ${pk} is NOT deleted`)
        }
    })
}


/**
 * Reverses the deletion of an assessment or subassessment.  Optional comment (otherwise generic text is used)
 */
export function reverseDeletion(offender: OffenderDef, type: 'Assessment' | 'Basic Custody Screening' | 'Sub Assessment - SARA', assessment: string, comment?: string) {

    const rev = new oasys.Pages.Admin.ReverseDeletion().goto()
    rev.type.setValue(type)
    rev.offenderSearch.setValue(offender.pnc)
    cy.get('#P10_SIGNING_COMMENTS').click()  // Force refresh to show offender LOV
    rev.offender.setValue(offender.surname)
    rev.assessment.setValue(assessment)
    rev.reason.setValue(comment ?? 'Reversing deletion')
    rev.ok.click()
    rev.ok.click()
    new oasys.Pages.Tasks.TaskManager().checkCurrent()
    cy.log(`Reversed deletion for ${offender.pnc}, ${type}, ${assessment}`)
}

/**
 * Roll back the assessment.  Assumes you are on an assessment page.
 */
export function rollBack(comment?: string) {

    const rollback = new oasys.Pages.Assessment.Other.RollbackAssessment().goto()
    rollback.ok.click()
    rollback.enterAComment.setValue(comment ?? 'Rollback test comment')
    rollback.ok.click()

    cy.log('Rolled back assessment')
}

/**
 * Open the latest assessment, assuming you have the assessments tab showing.
 */
export function openLatest() {

    new oasys.Pages.Offender.AssessmentsTab().assessments.clickFirstRow()
    cy.log('Opened latest assessment')
}

/**
 * Open an assessment selected by the row number in the table (1 at the top), assuming you have the assessments tab showing.
 */
export function open(row: number) {

    new oasys.Pages.Offender.AssessmentsTab().assessments.clickNthRow(row)
    cy.log('Opened latest assessment')
}

/**
 * Assuming you have the offender details open with assessment tab showing, clicks the Lock Incomplete button,
 * then checks and accepts the alert message.  Checks the standard message unless otherwise specified
 */
export function lockIncomplete(message?: string) {

    // Set up a Cypress event to trap the alert
    cy.on('window:confirm', (str) => {
        expect(str).to.equal(message ?? 'Do you wish to lock the assessment as incomplete?')
    })
    oasys.Nav.clickButton('Lock Incomplete', true)
    cy.log('Locked assessment incomplete')
}

/**
 * Sign and lock an assessment.  The optional parameter is an object with optional properties as listed below.
 * 
 * The function will attempt to deal with normal process flows depending on the parameter values. Assumes you are on an assessment page with a Sign & Lock button, 
 * unless the 'page' property is specified - in that case you just need to be in the assessment.
 * 
 *   - page: an assessment page to select, e.g. pages.SentencePlan.IspSection52to8
 *   - expectOutstandingQuestion: if true, expect to get an Outstanding Question page
 *   - expectRsrScore: if true, expect to get an RSR Score page
 *   - expectRsrWarning: if true, expect to get an RSR Warning page
 *   - expectCountersigner: if true, expect countersigning
 *   - countersignCancel: allows you to cancel out after confirming that a countersignature is required
 *   - countersigner: either a predefined User object, or a string to enter as the countersigner
 *   - countersignComment: countersigner comment (a generic comment will be entered if this is not specified)
 */
export function signAndLock(
    params?: {
        page?: IPage, expectOutstandingQuestions?: boolean, expectRsrScore?: boolean, expectRsrWarning?: boolean,
        expectCountersigner?: boolean, countersignCancel?: boolean, countersigner?: any, countersignComment?: string,
    }) {

    cy.log(`Sign & lock assessment`)

    if (params?.page) {
        new params.page().goto(true)
    }
    oasys.Nav.clickButton('Sign & Lock', true)

    const signingStatus = new oasys.Pages.Signing.SigningStatus()

    if (params?.expectOutstandingQuestions) {
        signingStatus.continueWithSigning.click()
    }
    if (params?.expectRsrScore) {
        new oasys.Pages.Signing.RsrConfirm().ok.click()
    }
    if (params?.expectRsrWarning) {
        signingStatus.continueWithSigning.click()
    }

    signingStatus.confirmSignAndLock.click()

    if (params?.expectCountersigner) {
        const cPage = new oasys.Pages.Signing.CountersignatureRequired()
        if (params?.countersignCancel) {
            cPage.cancel.click()
        }
        else {
            if (params.countersigner?.constructor?.name == 'User') {
                cPage.countersigner.setValue((params.countersigner as User).lovLookup)
            } else if (params.countersigner != null) {
                cPage.countersigner.setValue(params.countersigner as string)
            }
            cPage.comments.setValue(params.countersignComment ?? 'Assessment needs to be countersigned')
            cPage.confirm.click()
        }
    }

    if (!params?.countersignCancel) {
        new oasys.Pages.Tasks.TaskManager().checkCurrent()
    }
}

/**
 * Countersign an assessment.  The optional parameter is a CountersignParams object which may contain:
 * 
 *   - page: an assessment page to select, e.g. oasys.pages.SentencePlan.IspSection52to8, assuming you are already in the assessment.
 * OR
 *   - offender: an Offender object; if this is provided, the assessment will be opened by searching for a countersigning task
 * 
 * If neither of the above are provided, you should already be on a page with the Countersigning button available.
 * 
 *   - comment: countersigning comment (a generic comment will be used if this is not provided)
 */
export function countersign(params?: { page?: IPage, offender?: OffenderDef, comment?: string }) {

    cy.log(`Countersign assessment`)

    if (params?.offender) {
        oasys.Task.openAssessmentFromCountersigningTaskByName(params.offender.surname)
        oasys.Nav.clickButton('Return to Assessment')
    }

    if (params?.page) {
        new params.page().goto(true)
    }

    oasys.Nav.clickButton('Countersign')
    const countersigning = new oasys.Pages.Signing.Countersigning()
    countersigning.selectAction.setValue('Countersign')
    countersigning.comments.setValue(params?.comment ?? 'Countersigning the assessment')
    countersigning.ok.click()
    new oasys.Pages.Tasks.TaskManager().checkCurrent()
}

/**
 * Checks that the expected set of OASYS_SIGNING records are found for a given assessment PK; the expectedActions parameter should include all actions, latest first.
 */
export function checkSigningRecord(pk: number, expectedActions: AssessmentSigning[]) {

    oasys.Db.getData(`select signing_action_elm from eor.oasys_signing where oasys_set_pk = ${pk} order by create_date desc`, 'data')
    cy.get<string[][]>('@data').then((data) => {

        cy.log(`Checking OASYS_SIGNING actions for ${pk}: ${JSON.stringify(data)}`)

        expect(data.length).eq(expectedActions.length)
        for (let i = 0; i < expectedActions.length; i++) {
            expect(data[i][0]).eq(expectedActions[i])
        }
    })
}

