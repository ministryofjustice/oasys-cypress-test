import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection9 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection9'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 9' }

    escapeAnalysis = new Element.Textbox('#textarea_FA65')
    disruptionTrustAnalysis = new Element.Textbox('#textarea_FA66')
}
