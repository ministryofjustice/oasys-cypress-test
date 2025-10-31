import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection8 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection8'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 8' }

    suicideSelfHarm = new Element.Textbox('#textarea_FA62')
    custodyAnalysis = new Element.Textbox('#textarea_FA63')
    vulnerabilityAnalysis = new Element.Textbox('#textarea_FA64')
    roshOthers = new Element.Select<YesNoAnswer>('#itm_FA49')
    riskDetails = new Element.Textbox('#textarea_FA49_t')
}
