﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class Section11 extends BaseAssessmentPage {

    name = 'Section11'
    title = '11 - Thinking and Behaviour'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '11 - Thinking & Behaviour' }

    noIssues = new Element.Button('No Issues')
    o11_1 = new Element.Select<ProblemsMissingAnswer>('#itm_11_1')
    o11_2 = new Element.Select<ProblemsMissingAnswer>('#itm_11_2')
    o11_3 = new Element.Select<ProblemsMissingAnswer>('#itm_11_3')
    o11_4 = new Element.Select<ProblemsMissingAnswer>('#itm_11_4')
    o11_5 = new Element.Select<ProblemsMissingAnswer>('#itm_11_5')
    o11_6 = new Element.Select<ProblemsMissingAnswer>('#itm_11_6')
    o11_7 = new Element.Select<ProblemsMissingAnswer>('#itm_11_7')
    o11_8 = new Element.Select<ProblemsMissingAnswer>('#itm_11_8')
    o11_9 = new Element.Select<ProblemsMissingAnswer>('#itm_11_9')
    o11_10 = new Element.Select<ProblemsMissingAnswer>('#itm_11_10')
    o11_11 = new Element.Select<ProblemsMissingAnswer>('#itm_11_11')
    o11_12 = new Element.Select<ProblemsMissingAnswer>('#itm_11_12')
    identifyIssues = new Element.Textbox('#textarea_11_97')
    linkedToRisk = new Element.Select('#itm_11_98')
    linkedToBehaviour = new Element.Select('#itm_11_99')
}


