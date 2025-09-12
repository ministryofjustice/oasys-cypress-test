import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CrnAmendment extends Page {

    name = 'CRNAmendment'

    probationCrn = new Element.Textbox('#P2_CRN')
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
