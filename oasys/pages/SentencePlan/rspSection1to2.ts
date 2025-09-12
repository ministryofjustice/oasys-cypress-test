import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { SentencePlan } from './sentencePlan'

export class RspSection1to2 extends SentencePlan {

    name = 'RSPSection1to2'
    title = 'Review Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Section 1 to 2' }

    reviewNumber = new Element.Textbox<number>('#itm_RP_1')
    reviewDate = new Element.Textbox<OasysDate>('#itm_RP_2')
    typeOfAssessment = new Element.Select('#itm_RP_3')
    transferDate = new Element.Textbox<OasysDate>('#itm_RP_4')
    terminationDate = new Element.Textbox<OasysDate>('#itm_RP_6')
    rp7 = new Element.Select('#itm_RP_7')
    rp8 = new Element.Select('#itm_RP_8')
    rp9 = new Element.Textbox('#itm_RP_9')
    rp10 = new Element.Textbox('#itm_RP_10')
    rp11 = new Element.Select('#itm_RP_11')
    rp12 = new Element.Select('#itm_RP_12')
    rp13 = new Element.Select('#itm_RP_13')
    rp14 = new Element.Select('#itm_RP_14')
    rp15 = new Element.Select('#itm_RP_15')
    rp16 = new Element.Select('#itm_RP_16')
    rp17 = new Element.Select('#itm_RP_17')
    rp18 = new Element.Select('#itm_RP_18')
    rp19 = new Element.Select('#itm_RP_19')
    rp20 = new Element.Textbox('#textarea_RP_20')
    rp21 = new Element.Select('#itm_RP_21')
    rp22 = new Element.Select('#itm_RP_22')
    rp23 = new Element.Select('#itm_RP_23')
    rp24 = new Element.Textbox('#textarea_RP_24')
    rp25 = new Element.Select('#itm_RP_25')
}
