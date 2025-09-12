import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CreateAssessment extends Page {

    name = 'CreateAssessment'
    title = 'Create Assessment'

    purposeOfAssessment = new Element.Select<PurposeOfAssessment>('#P10_PURPOSE_ASSESSMENT_ELM')
    otherPleaseSpecify = new Element.Textbox('#P10_PURPOSE_OF_ASSESS_OTHER')
    assessmentLayer = new Element.Select<AssessmentLayer>('#P10_ASSESSMENT_TYPE_ELM')
    sentencePlanType = new Element.Select<SentencePlan | '-- Select Type --'>('#P10_SSP_TYPE_ELM')
    includeCourtReportTemplate = new Element.Select<YesNoAnswer>('#P10_COURT_RPT_TEMPLATE')
    selectTeam = new Element.Select('#P10_TEAM_UK')
    selectAssessor = new Element.Lov('#P10_ASSESSOR_USER_CODE_LABEL')
    includeSanSections = new Element.Select<YesNoAnswer>('#P10_INCLUDE_SAN')
    create = new Element.Button('Create')
    cancel = new Element.Button('Cancel')
}
