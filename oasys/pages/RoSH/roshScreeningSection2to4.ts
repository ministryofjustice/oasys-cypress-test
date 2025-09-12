import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshScreeningSection2to4 extends BaseAssessmentPage {

    name = 'RoshScreeningSection2to4'
    title = 'Risk of Serious Harm Screening'
    menu: Menu = { type: 'Floating', level1: 'RoSH Screening', level2: 'Section 2 to 4' }

    factors = new Element.Textbox('#textarea_R2_2_2')
    r2_3 = new Element.Select('#itm_R2_3')
    rationale = new Element.Textbox('#textarea_R2_3_1')
    r2_4_1 = new Element.Select('#itm_R2_4_1')
    r2_4_2 = new Element.Select('#itm_R2_4_2')
    r3_1 = new Element.Select('#itm_R3_1')
    r3_2 = new Element.Select('#itm_R3_2')
    r3_3 = new Element.Select('#itm_R3_3')
    r3_4 = new Element.Select('#itm_R3_4')
    r4_1 = new Element.Select('#itm_R4_1')
    r4_2 = new Element.Select('#itm_R4_2')
    r4_3 = new Element.Select('#itm_R4_3')
    r4_4 = new Element.Select('#itm_R4_4')
}
