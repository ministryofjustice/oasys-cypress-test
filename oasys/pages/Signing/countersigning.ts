import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Countersigning extends Page {

    name = 'Countersigning'
    menu: Menu = { type: 'Subform', level1: 'Countersign' }

    ok = new Element.Button('Ok')
    cancel = new Element.Button('Cancel')
    selectAction = new Element.Select<'Countersign'|'Reject for Rework'>('#P3_CS_ACTION_LOV')
    comments = new Element.Textbox('#P3_COUNTERSIGN_COMMENTS')
}
