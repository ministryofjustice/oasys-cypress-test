import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CreatePsr extends Page {

    name = 'CreatePSR'
    menu: Menu = { type: 'Floating', level1: 'Pre-Sentence Report' }

    dateReportRequested = new Element.Textbox<OasysDate>('#P100_DATE_REPORT_REQUESTED')
    dateReportRequired = new Element.Textbox<OasysDate>('#P100_DATE_REPORT_REQUIRED')
    sentenceDate = new Element.Textbox<OasysDate>('#P100_SENTENCE_DATE')
    proximity = new Element.Select('#P100_COURT_PROXIMITY')
    courtName = new Element.Lov('#P100_PSR_COURT_LABEL')
    courtType = new Element.Textbox('#P100_COURT_TYPE')
    actualCourtName = new Element.Textbox('#P100_ACT_COURT_NAME')
    authorType = new Element.Select('#P100_COURT_REPORT_AUTHOR_ELM')
    authorsTeam = new Element.Select('#P100_TEAM_UK')
    author = new Element.Lov('#P100_OASYS_USER_CODE_LABEL')
    offenderTitle = new Element.Select('#P100_OFFENDER_TITLE')
    offenderName = new Element.Select('#P100_OFFENDER_NAME')
    create = new Element.Button('Create')
}
