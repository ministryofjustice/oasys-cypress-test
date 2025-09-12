import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RemovePsr extends Page {

    name = 'RemovePSR'
    title = 'Administration Functions - Remove/Append PSR'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Remove PSR' }

    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
