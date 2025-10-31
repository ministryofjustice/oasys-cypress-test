﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshSummary extends BaseAssessmentPage {

    name = 'RoshSummary'
    title = 'Risk of Serious Harm Summary'
    menu: Menu = { type: 'Floating', level1: 'RoSH Summary' }

    r10_1 = new Element.Textbox('#textarea_SUM1')
    insertNames = new Element.Button("//input[@type='button' and contains(@value,'Insert children')]")
    r10_2 = new Element.Textbox('#textarea_SUM2')

    riskFactorAnslysis = new Element.Textbox('#textarea_SUM9')
    r10_5 = new Element.Textbox('#textarea_SUM10')
    r10_3 = new Element.Textbox('#textarea_SUM11')

    r10_6ChildrenCommunity = new Element.Select<RiskLevel>('#itm_SUM6_1_1')
    r10_6ChildrenCustody = new Element.Select<RiskLevel>('#itm_SUM6_1_2')
    r10_6PublicCommunity = new Element.Select<RiskLevel>('#itm_SUM6_2_1')
    r10_6PublicCustody = new Element.Select<RiskLevel>('#itm_SUM6_2_2')
    r10_6AdultCommunity = new Element.Select<RiskLevel>('#itm_SUM6_3_1')
    r10_6AdultCustody = new Element.Select<RiskLevel>('#itm_SUM6_3_2')
    r10_6StaffCommunity = new Element.Select<RiskLevel>('#itm_SUM6_4_1')
    r10_6StaffCustody = new Element.Select<RiskLevel>('#itm_SUM6_4_2')
    r10_6PrisonersCustody = new Element.Select<RiskLevel>('#itm_SUM6_5_2')
    details = new Element.Textbox('#textarea_SUM8')
}
