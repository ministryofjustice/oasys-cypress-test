import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { SentencePlan } from './sentencePlan'

export class IspSection1to4 extends SentencePlan {

    name = 'ISPSection1to4'
    title = 'Initial Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Initial Sentence Plan', level2: 'Section 1 to 4' }

    safCompleted = new Element.Select('#itm_IP_1')
    keyIssues = new Element.Textbox('#textarea_IP_2')
    motivation = new Element.Textbox('#XI_itm_12_8')
    motivationSelect = new Element.Select('#itm_IP3')
    capacity = new Element.Select('#itm_IP_4')
    workToIncrease = new Element.Textbox('#textarea_IP_5')
    inhibitingFactors = new Element.Textbox('#textarea_IP_6')
    positiveFactors = new Element.Textbox('#textarea_IP_7')
    incentiveLevel = new Element.Select('#itm_IP_8')
    victimLocation = new Element.Select('#itm_IP_9')
    victimImpactAwareness = new Element.Textbox('#textarea_IP_10')
    discriminationExperience = new Element.Textbox('#textarea_IP_11')
    discriminatoryBehaviour = new Element.Textbox('#textarea_IP_12')
}
