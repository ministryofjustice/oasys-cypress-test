import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class EditReferenceData extends Page {

    name = 'EditReferenceData'
    title = 'Core Reference Data Maintenance'

    code = new Element.Textbox('#P10_REF_ELEMENT_CODE')
    description = new Element.Textbox('#P10_REF_ELEMENT_DESC')
    shortDesc = new Element.Textbox('#P10_REF_ELEMENT_SHORT_DESC')
    opolCode = new Element.Textbox('#P10_REF_ELEMENT_CTID')
    startDate = new Element.Textbox<OasysDate>('#P10_START_DATE')
    endDate = new Element.Textbox<OasysDate>('#P10_END_DATE')
    close = new Element.Button('Close')
    save = new Element.Button('Save')
}
