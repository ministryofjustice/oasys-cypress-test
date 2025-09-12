import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class SanSections extends BaseAssessmentPage {

    name = 'SanSections'
    title = 'Strengths and Needs'
    menu: Menu = { type: 'Floating', level1: 'Strengths and Needs' }

    openSanLabel = new Element.Text(`div:contains('To exit OASys and launch into the Strengths and Needs Service please click on the button below')`)
    openSan = new Element.Button('Open Strengths and Needs')
}


