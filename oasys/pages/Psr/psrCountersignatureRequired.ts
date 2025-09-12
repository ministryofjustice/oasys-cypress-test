import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PsrCountersignatureRequired extends Page {

    name = 'PSRCountersignatureRequired'

    countersigner = new Element.Select('#P450_COUNTERSIGNER')
    oK = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
