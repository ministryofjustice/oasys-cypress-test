import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class DeleteSigningRoleConfirmation extends Page {

    name = 'DeleteSigningRoleConfirmation'
    title = 'Delete Signing Role Confirmation'

    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
