import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ReverseDeletion extends Page {

    name = 'ReverseDeletion'
    title = 'Reverse Deletion'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Reverse Deletions' }

    type = new Element.Select<'Assessment' | 'Basic Custody Screening' | 'INTBDTTO' | 'Offender' | 'Sub Assessment - RM2000' | 'Sub Assessment - SARA'>('#P10_ACTION')
    offenderSearch = new Element.Textbox('#P10_OFFENDER_SEARCH')
    offender = new Element.Lov('#P10_OFFENDER_LABEL')
    assessment = new Element.Lov('#P10_ASSESSMENT_LABEL')
    reason = new Element.Textbox('#P10_SIGNING_COMMENTS')
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
