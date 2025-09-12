import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection61 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection61'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 6.1' }

    insertOffenceDetails = new Element.Button('Insert offence details from Q2.1')
    what = new Element.Textbox('#textarea_FA1')
    whereAndWhen = new Element.Textbox('#textarea_FA2')
    how = new Element.Textbox('#textarea_FA3')
    victims = new Element.Textbox('#textarea_FA4')
    anyoneElse = new Element.Textbox('#textarea_FA5')
    insertEvidence = new Element.Button('Insert evidence from Q2.8')
    why = new Element.Textbox('#textarea_FA6')
    sourcesOfInformation = new Element.Textbox('#textarea_FA7')
}
