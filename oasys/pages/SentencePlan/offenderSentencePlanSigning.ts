import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OffenderSentencePlanSigning extends Page {

    name = 'OffenderSentencePlanSigning'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Add Offender Sentence Plan Signed Date' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    signed = new Element.Select('#P3_OFFENDER_SIGNED_LOV')
    dateSigned = new Element.Textbox<OasysDate>('#P3_DATE_SIGNED')
    comments = new Element.Textbox('#P3_PLAN_COMMENTS')
    reasons = new Element.Textbox('#P3_DECLINES_TO_SIGN_REASON')
}
