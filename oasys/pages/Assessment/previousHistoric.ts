import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class PreviousHistoric extends BaseAssessmentPage {

    name = 'PreviousHistoric'
    title = 'Create Assessment'

    no = new Element.Button('No')
    yes = new Element.Button('Yes')
}
