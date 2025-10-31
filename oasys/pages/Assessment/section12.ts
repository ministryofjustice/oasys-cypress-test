﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class Section12 extends BaseAssessmentPage {

    name = 'Section12'
    title = '12 - Attitudes'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '12 - Attitudes' }

    noIssues = new Element.Button('No Issues')
    o12_1 = new Element.Select<ProblemsMissingAnswer>('#itm_12_1')
    o12_3 = new Element.Select<ProblemsMissingAnswer>('#itm_12_3')
    o12_4 = new Element.Select<ProblemsMissingAnswer>('#itm_12_4')
    o12_5 = new Element.Select<ProblemsMissingAnswer>('#itm_12_5')
    o12_6 = new Element.Select<ProblemsMissingAnswer>('#itm_12_6')
    o12_8 = new Element.Select<'' | '0-Very motivated' | '1-Quite motivated' | '2-Not at all'>('#itm_12_8')
    o12_9 = new Element.Select<ProblemsMissingAnswer>('#itm_12_9')
    identifyIssues = new Element.Textbox('#textarea_12_97')
    linkedToRisk = new Element.Select('#itm_12_98')
    linkedToBehaviour = new Element.Select('#itm_12_99')
}


