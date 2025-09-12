import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainUser extends Page {

    name = 'MaintainUser'
    title = 'Maintain User'

    disableAccount = new Element.Button('Disable Account')
    password = new Element.Button('Password')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    userName = new Element.Textbox('#P8_OASYS_USER_CODE')
    surname = new Element.Textbox('#P8_USER_FAMILY_NAME')
    forename1 = new Element.Textbox('#P8_USER_FORENAME_1')
    forename2 = new Element.Textbox('#P8_USER_FORENAME_2')
    emailAddress = new Element.Textbox('#P8_EMAIL_ADDRESS')
    excludeFromAutomaticDisabling = new Element.Checkbox('#P8_EXCL_DEACT_IND_0')
    dragon = new Element.Checkbox('#P8_AT_SOFTWARE_0')
    jaws = new Element.Checkbox('#P8_AT_SOFTWARE_1')
    readAndWrite = new Element.Checkbox('#P8_AT_SOFTWARE_2')
    zoomtext = new Element.Checkbox('#P8_AT_SOFTWARE_3')
}
