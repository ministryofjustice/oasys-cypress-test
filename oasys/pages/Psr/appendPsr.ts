import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AppendPsr extends Page {

    name = 'AppendPSR'
    title = 'Administration Functions - Remove/Append PSR'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Append PSR' }

    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
    selectType = new Element.Select('#P3_REPORT_TYPE')
}
