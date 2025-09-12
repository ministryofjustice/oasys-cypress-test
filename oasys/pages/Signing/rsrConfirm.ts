import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RsrConfirm extends Page {

    name = 'RsrConfirm'

    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
    rsrDetails = new Element.Text('#P3_RSR_ALERT_DISPLAY')
}
