import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OffenderAddressTab extends Page {

    name = 'OffenderAddressTab'

    noFixedAbode = new Element.Checkbox('#P10_NFA_IND_0')
    aptFlatNumber = new Element.Textbox('#P10_ADDRESS_LINE_1')
    premisesNameNumber = new Element.Textbox('#P10_ADDRESS_LINE_2')
    street = new Element.Textbox('#P10_ADDRESS_LINE_3')
    locality = new Element.Textbox('#P10_ADDRESS_LINE_4')
    town = new Element.Textbox('#P10_ADDRESS_LINE_5')
    county = new Element.Textbox('#P10_ADDRESS_LINE_6')
    postcode = new Element.Textbox('#P10_ADDRESS_POSTCODE')
    telephone = new Element.Textbox('#P10_TELEPHONE_NUMBER')
    localAuthority = new Element.Select('#P10_LOCAL_AUTHORITY_ELM')
}
