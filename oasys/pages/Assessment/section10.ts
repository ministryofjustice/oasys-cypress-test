﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class Section10 extends BaseAssessmentPage {

    name = 'Section10'
    title = '10 - Emotional Well-being'
    menu: Menu = { type: 'Floating', level1: 'Section 2 to 13', level2: '10 - Emotional Well-being' }

    noIssues = new Element.Button('No Issues')
    o10_1 = new Element.Select<ProblemsAnswer>('#itm_10_1')
    o10_2 = new Element.Select<ProblemsAnswer>('#itm_10_2')
    o10_3 = new Element.Select<ProblemsAnswer>('#itm_10_3')
    o10_4 = new Element.Select<ProblemsAnswer>('#itm_10_4')
    o10_5 = new Element.Select('#itm_10_5')
    o10_6 = new Element.Select<ProblemsAnswer>('#itm_10_6')
    o10_7Childhood = new Element.Select<YesNoAnswer>('#itm_10_7_V2_CHILDHOOD')
    o10_7HeadInjuries = new Element.Select<YesNoAnswer>('#itm_10_7_V2_HISTHEADINJ')
    o10_7Psychiatric = new Element.Select<YesNoAnswer>('#itm_10_7_V2_HISTPSYCH')
    o10_7Medication = new Element.Select<YesNoAnswer>('#itm_10_7_V2_MEDICATION')
    o10_7FailedCoOp = new Element.Select<YesNoAnswer>('#itm_10_7_V2_FAILEDTOCOOP')
    o10_7Patient = new Element.Select<YesNoAnswer>('#itm_10_7_V2_PATIENT')
    o10_7Treatment = new Element.Select<YesNoAnswer>('#itm_10_7_V2_PSYCHTREAT')
    o10_8 = new Element.Select<YesNoAnswer>('#itm_10_8')
    identifyIssues = new Element.Textbox('#textarea_10_97')
    linkedToRisk = new Element.Select('#itm_10_98')
    linkedToBehaviour = new Element.Select('#itm_10_99')
}


