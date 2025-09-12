﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class Section7 extends BaseAssessmentPage {

    name = 'Section7'
    title = '7 - Lifestyle and Associates'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '7 - Lifestyle & Associates' }

    noIssues = new Element.Button('No Issues')
    o7_1 = new Element.Select('#itm_7_1')
    o7_2 = new Element.Select('#itm_7_2')
    o7_3 = new Element.Select('#itm_7_3')
    o7_4 = new Element.Select('#itm_7_4')
    o7_5 = new Element.Select('#itm_7_5')
    identifyIssues = new Element.Textbox('#textarea_7_97')
    linkedToRisk = new Element.Select('#itm_7_98')
    linkedToBehaviour = new Element.Select('#itm_7_99')
}


