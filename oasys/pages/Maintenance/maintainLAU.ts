import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainLau extends Page {

    name = 'MaintainLau'
    title = 'Maintain LAU'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    lauName = new Element.Textbox('#P10_DIVISION_NAME')
    status = new Element.Radiogroup('#P10_ACTIVE')
}
