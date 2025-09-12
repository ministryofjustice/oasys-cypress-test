import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MarkAssessmentHistoric extends Page {

    name = 'MarkAssessmentHistoric'
    title = 'Administration Functions - Mark Assessment Historic'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Mark Assessments as Historic' }

    ok = new Element.Button('OK')
    cancel = new Element.Button('Cancel')
}
