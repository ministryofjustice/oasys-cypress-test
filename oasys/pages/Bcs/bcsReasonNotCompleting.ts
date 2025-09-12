import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class BcsReasonNotCompleting extends Page {

    name = 'BCSReasonNotCompleting'

    ok = new Element.Button('Ok')
    cancel = new Element.Button('Cancel')
    reason = new Element.Select('#P2_REASON_ELM')
    otherReason = new Element.Textbox('#P2_OTHER_REASON')
}
