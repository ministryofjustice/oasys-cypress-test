import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class DeleteSara extends Page {

    name = 'DeleteSARA'
    title = 'Administration Functions - Delete'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Delete SARA' }

    reasonForDeletion = new Element.Textbox('#P3_REASON_FOR_DELETION')
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
