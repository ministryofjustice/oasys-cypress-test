import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PsrCountersigning extends Page {

    name = 'PSRCountersigning'

    selectAction = new Element.Select('#P450_COUNTERSIGN_ACTION')
    rejectionReason = new Element.Textbox('#P450_REJECTION_REASON')
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
