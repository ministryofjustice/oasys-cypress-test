﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class Section9 extends BaseAssessmentPage {

    name = 'Section9'
    title = '9 - Alcohol Misuse'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '9 - Alcohol Misuse' }

    noIssues = new Element.Button('No Issues')
    o9_1 = new Element.Select<ProblemsAnswer>('#itm_9_1')
    o9_1Details = new Element.Textbox('#textarea_9_1_t')
    o9_2 = new Element.Select<ProblemsAnswer>('#itm_9_2')
    o9_3 = new Element.Select<ProblemsAnswer>('#itm_9_3')
    o9_4 = new Element.Select<YesNoMissingAnswer>('#itm_9_4')
    o9_5 = new Element.Select<ProblemsAnswer>('#itm_9_5')
    identifyIssues = new Element.Textbox('#textarea_9_97')
    linkedToRisk = new Element.Select('#itm_9_98')
    linkedToBehaviour = new Element.Select('#itm_9_99')
}


