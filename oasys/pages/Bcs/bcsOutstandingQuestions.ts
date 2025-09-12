import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class BcsOutstandingQuestions extends Page {

    name = 'BCSOutstandingQuestions'

    confirmSignAndLock = new Element.Button('Confirm Sign & Lock')
    returnToAssessment = new Element.Button('Return to Assessment')
    cancel = new Element.Button('Cancel')
}
