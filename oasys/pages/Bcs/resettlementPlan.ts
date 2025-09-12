import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class ResettlementPlan extends BaseAssessmentPage {

    name = 'ResettlementPlan'
    title = 'Resettlement Plan'
    menu: Menu = { type: 'Floating', level1: 'Resettlement Plan' }

    signAndLock = new Element.Button('Sign & Lock')
    addNewAction = new Element.Button('Add New Action')
    actionsOnOffenders = new Element.Textbox('#textarea_TR_BCS143')
    preReleaseActivity = new Element.Checkbox('#itm_TR_BCS214_PRA_COMPLETE')
    comments = new Element.Textbox('#textarea_TR_BCS216')
}
