import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RollbackAssessment extends Page {

    name = 'RollbackAssessment'
    title = 'Administration Functions - Assessment Rollback'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Rollback Assessment' }

    enterAComment = new Element.Textbox('#P7_USER_COMMENTS')
    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
    rollbackAssessmentAndCourtReport = new Element.Button('Rollback Assessment and Court Report')
    rollbackAssessment = new Element.Button('Rollback Assessment')
}
