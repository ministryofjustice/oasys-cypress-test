﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshScreeningSection2to4 extends BaseAssessmentPage {

    name = 'RoshScreeningSection2to4'
    title = 'Risk of Serious Harm Screening'
    menu: Menu = { type: 'Floating', level1: 'RoSH Screening', level2: 'Section 2 to 4' }

    factors = new Element.Textbox('#textarea_R2_2_2')
    r2_3 = new Element.Select<YesNoAnswer>('#itm_R2_3')     // Could the individual’s behaviour and circumstances have a negative impact on a child’s wellbeing?
    rationale = new Element.Textbox('#textarea_R2_3_1')
    r2_4_1 = new Element.Select<YesNoAnswer>('#itm_R2_4_1') // Identifiable children
    r2_4_2 = new Element.Select<YesNoAnswer>('#itm_R2_4_2') // Children in general
    r3_1 = new Element.Select<YesNoDKAnswer>('#itm_R3_1')   // Risk of suicide
    r3_2 = new Element.Select<YesNoDKAnswer>('#itm_R3_2')   // Risk of self-harm
    r3_3 = new Element.Select<YesNoDKAnswer>('#itm_R3_3')   // Coping in Custody / Approved Premises / Hostel
    r3_4 = new Element.Select<YesNoDkAnswer>('#itm_R3_4')   // Vulnerability
    r4_1 = new Element.Select<YesNoDKAnswer>('#itm_R4_1')   // Escape / abscond
    r4_6 = new Element.Select<YesNoDKAnswer>('#itm_R4_6')   // Control Issues / Disruptive Behaviour and Breach of Trust
    r4_4 = new Element.Select<YesNoDkAnswer>('#itm_R4_4')   // Risks to other prisoners
}
