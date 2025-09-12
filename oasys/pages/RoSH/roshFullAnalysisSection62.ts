import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection62 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection62'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 6.2' }

    what = new Element.Textbox('#textarea_FA8')
    whereAndWhen = new Element.Textbox('#textarea_FA9')
    how = new Element.Textbox('#textarea_FA10')
    victims = new Element.Textbox('#textarea_FA11')
    anyoneElse = new Element.Textbox('#textarea_FA12')
    why = new Element.Textbox('#textarea_FA13')
    sourcesOfInformation = new Element.Textbox('#textarea_FA14')
}
