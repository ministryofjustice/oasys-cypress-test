import * as Element from 'classes/elements'
import { Page } from 'classes/page'

export class IomStub extends Page {

    name = 'IOM Stub'

    probationCrn = new Element.Textbox('#add-CRN')
    isIom = new Element.Textbox('#add-OIM')
    records = new Element.Textbox('#add-NUM')
    error = new Element.Select('#add-CODE')
    mappa = new Element.Textbox('#add-MAPPA')
    add = new Element.Button(`input[type='submit'][value='Add']`)
}
