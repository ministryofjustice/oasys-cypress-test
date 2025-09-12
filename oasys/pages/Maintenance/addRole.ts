import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AddRole extends Page {

    name = 'AddRole'
    title = 'Add Role'

    roleName = new Element.Textbox('#P10_REF_ROLE_DESC')
    copyFunctionsFromRole = new Element.Select('#P10_SELECT_ROLE')
    close = new Element.Button('Close')
    save = new Element.Button('Save')
}
