import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class DeleteAssessment extends Page {

    name = 'DeleteAssessment'
    title = 'Administration Functions - Delete'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Delete Assessment' }

    reasonForDeletion = new Element.Textbox('#P3_REASON_FOR_DELETION')
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
