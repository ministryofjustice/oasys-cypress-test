import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection62 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection62'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 6.2' }

    harmfulBehaviours = new Element.Textbox('#textarea_FA61')
    behaviourPatterns = new Element.Textbox('#textarea_FA67')
}
