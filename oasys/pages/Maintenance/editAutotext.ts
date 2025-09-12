import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class EditAutotext extends Page {

    name = 'EditAutotext'
    title = 'Edit Auto Text'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    autotextType = new Element.Select('#P4_PERSONAL_OR_GLOBAL')
    autotext = new Element.Textbox('#P4_DISPLAY_TEXT')
}
