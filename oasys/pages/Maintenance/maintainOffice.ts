import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainOffice extends Page {

    name = 'MaintainOffice'
    title = 'Maintain Office'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    officeName = new Element.Textbox('#P10_OFFICE_NAME')
    officeAddressLine1 = new Element.Textbox('#P10_OFFICE_ADDRESS_LINE_1')
    officeAddressLine2 = new Element.Textbox('#P10_OFFICE_ADDRESS_LINE_2')
    officeAddressLine3 = new Element.Textbox('#P10_OFFICE_ADDRESS_LINE_3')
    officeAddressLine4 = new Element.Textbox('#P10_OFFICE_ADDRESS_LINE_4')
    officePostcode = new Element.Textbox('#P10_OFFICE_POSTCODE')
    officeTelephone = new Element.Textbox('#P10_OFFICE_TELEPHONE')
    officeFax = new Element.Textbox('#P10_OFFICE_FAX')
    status = new Element.Radiogroup('#P10_ACTIVE')
}
