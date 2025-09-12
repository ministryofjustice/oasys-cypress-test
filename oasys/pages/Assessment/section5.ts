import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class Section5 extends BaseAssessmentPage {

    name = 'Section5'
    title = '5 - Financial Management and Income'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '5 - Finance' }

    noIssues = new Element.Button('No Issues')
    o5_2 = new Element.Select('#itm_5_2')
    o5_3 = new Element.Select('#itm_5_3')
    o5_4 = new Element.Select('#itm_5_4')
    o5_5 = new Element.Select('#itm_5_5')
    o5_6 = new Element.Select('#itm_5_6')
    identifyIssues = new Element.Textbox('#textarea_5_97')
    linkedToRisk = new Element.Select('#itm_5_98')
    linkedToBehaviour = new Element.Select('#itm_5_99')
}


