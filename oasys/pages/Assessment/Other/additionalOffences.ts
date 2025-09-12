import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AdditionalOffences extends Page {

    name = 'AdditionalOffences'
    title = 'Add Offence'
    menu: Menu = { type: 'Subform', level1: 'Add Additional Offences' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    offence = new Element.Textbox('#P5_CT_OFFENCE_CODE_TEXT')
    offenceDescription = new Element.Textbox('#LOVDSC_P5_CT_OFFENCE_CODE_TEXT')
    subcode = new Element.Textbox('#P5_CT_OFFENCE_SUBCODE_TEXT')
    subcodeDescription = new Element.Textbox('#LOVDSC_P5_CT_OFFENCE_SUBCODE_TEXT')
    count = new Element.Textbox('#P5_COUNT_OF_OFFENCES')
}
