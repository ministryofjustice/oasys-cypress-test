import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RollbackSara extends Page {

    name = 'RollbackSARA'
    title = 'Administration Functions - SARA Rollback'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Rollback SARA' }

    message = new Element.Text("This will rollback the SARA signing information. Click 'OK' to continue with the SARA rollback, otherwise click 'Cancel'.")
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
    rollbackAssessmentMessage = new Element.Text('If you wish to rollback this SARA, you must first rollback the OASys assessment')
}
