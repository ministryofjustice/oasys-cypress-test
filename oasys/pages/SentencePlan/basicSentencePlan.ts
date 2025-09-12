import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class BasicSentencePlan extends Page {

    name = 'BasicSentencePlan'
    title = 'Basic Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Basic Sentence Plan' }

    signAndLock = new Element.Button('Sign & Lock')
    countersign = new Element.Button('Countersign')
    countersignOverview = new Element.Button('Countersign Overview')
    printSentencePlan = new Element.Button('Print Sentence Plan')
    typeOfAssessment = new Element.Select('#itm_BSP_1')
    transferDate = new Element.Textbox<OasysDate>('#itm_BSP_2')
    terminationDate = new Element.Textbox<OasysDate>('#itm_BSP_3')
    addAnotherObjective = new Element.Button('Add Another Objective')
    comments = new Element.Textbox('#textarea_BSP_4')
}
