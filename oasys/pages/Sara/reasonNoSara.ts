import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ReasonNoSara extends Page {

    name = 'ReasonNoSARA'
    menu: Menu = { type: 'Subform', level1: 'Cancel' }

    ok = new Element.Button('Ok')
    cancel = new Element.Button('Cancel')
    reason = new Element.Select<'There was no suitably trained assessor available'|'There are no indications within the current OASys that a SARA is required e.g. domestic abuse has occurred outside of Intimate Partner Abuse'>('#P2_REASON_ELM')
}
