import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshScreeningSection5 extends BaseAssessmentPage {

    name = 'RoshScreeningSection5'
    title = 'Risk of Serious Harm Screening'
    menu: Menu = { type: 'Floating', level1: 'RoSH Screening', level2: 'Section 5' }

    signAndLock = new Element.Button('Sign & Lock')
    countersign = new Element.Button('Countersign')
    countersignOverview = new Element.Button('Countersign Overview')
    r5_1 = new Element.Select('#itm_R5_1')
    r5_1t = new Element.Textbox('#textarea_R5_1_t')
    r5_2 = new Element.Select('#itm_R5_2b')
    r5_2t = new Element.Textbox('#textarea_R5_2a')
}
