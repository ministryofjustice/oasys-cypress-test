import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PsrRollback extends Page {

    name = 'PSRRollback'
    title = 'Administration Functions - PSR Court Report Rollback'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Rollback Court Report' }

    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
