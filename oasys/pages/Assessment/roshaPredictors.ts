import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshaPredictors extends BaseAssessmentPage {

    name = 'RoshaPredictors'
    title = 'Risk of Serious Recidivism'
    menu: Menu = { type: 'Floating', level1: 'Predictors' }

    offence = new Element.Textbox('#P5_CT_OFFENCE_CODE_TEXT')
    offenceDescription = new Element.Textbox('#LOVDSC_P5_CT_OFFENCE_CODE_TEXT')
    subcode = new Element.Textbox('#P5_CT_OFFENCE_SUBCODE_TEXT')
    subcodeDescription = new Element.Textbox('#LOVDSC_P5_CT_OFFENCE_SUBCODE_TEXT')
    offenceLOV = new Element.Link("//Element[='P5_CT_OFFENCE_CODE_TEXT']/following::a/img")
    subcodeLOV = new Element.Link("//Element[='P5_CT_OFFENCE_SUBCODE_TEXT']/following::a/img")
    dateFirstSanction = new Element.Textbox<OasysDate>('#P5_QU_1_8_2')
    ageFirstSanction = new Element.Textbox('#P5_QU_1_8')
    o1_32 = new Element.Textbox('#P5_QU_1_32')
    o1_40 = new Element.Textbox('#P5_QU_1_40')
    o1_29 = new Element.Textbox('#P5_QU_1_29')
    o1_30 = new Element.Select('#P5_QU_1_30')
    o1_41 = new Element.Select('#P5_QU_1_41')
    o1_44 = new Element.Select('#P5_QU_1_44')
    o1_33 = new Element.Textbox('#P5_QU_1_33')
    o1_34 = new Element.Textbox('#P5_QU_1_34')
    o1_45 = new Element.Textbox('#P5_QU_1_45')
    o1_46 = new Element.Textbox('#P5_QU_1_46')
    o1_37 = new Element.Textbox('#P5_QU_1_37')
    o1_38 = new Element.Textbox('#P5_QU_1_38')
    o1_38Audit = new Element.Textbox('#P5_QU_1_38_T')
    o1_43 = new Element.Textbox('#P5_QU_1_43')
    o1_39 = new Element.Select('#P5_QU_1_39')
    o2_2 = new Element.Select('#P5_QU_2_2_V1')
    o2_2Weapon = new Element.Textbox('#P5_QU_2_2_T')
    o3_4 = new Element.Select('#P5_QU_3_4')
    o4_2 = new Element.Select('#P5_QU_4_2')
    o6_4 = new Element.Select('#P5_QU_6_4')
    o6_7 = new Element.Select('#P5_QU_6_7DA')
    o6_7VictimPartner = new Element.Select('#P5_QU_6_7_1_1DA')
    o6_7VictimFamily = new Element.Select('#P5_QU_6_7_1_2DA')
    o6_7PerpetratorPartner = new Element.Select('#P5_QU_6_7_2_1DA')
    o6_7PerpetratorFamily = new Element.Select('#P5_QU_6_7_2_2DA')
    o9_1 = new Element.Select('#P5_QU_9_1')
    o9_2 = new Element.Select('#P5_QU_9_2')
    o11_2 = new Element.Select('#P5_QU_11_2')
    o11_4 = new Element.Select('#P5_QU_11_4')
    o12_1 = new Element.Select('#P5_QU_12_1')
    ospIic = new Element.Textbox('#P5_OSPIIC_TEXTAREA')
    ospDc = new Element.Textbox('#P5_OSPDC_TEXTAREA')
    rsrScore = new Element.Textbox('#P5_REOFF_NEXT_2')
    rsrTextScore = new Element.Textbox('#P5_RSR_TEXT')
    o1_31 = new Element.Select('#P5_QU_1_31')
    o1_24 = new Element.Textbox('#P5_QU_1_24')
    o1_26 = new Element.Textbox('#P5_QU_1_26')
}
