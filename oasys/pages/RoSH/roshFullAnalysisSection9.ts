import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection9 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection9'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 9' }

    concernsEscape = new Element.Select('#itm_FA51')
    concernsEscapeDetails = new Element.Textbox('#textarea_FA51_t')
    concernsEscapePrevious = new Element.Select('#itm_FA53')
    concernsEscapePreviousDetails = new Element.Textbox('#textarea_FA53_t')
    concernsControl = new Element.Select('#itm_FA55')
    concernsControlDetails = new Element.Textbox('#textarea_FA55_t')
    concernsControlPrevious = new Element.Select('#itm_FA56')
    concernsControlPreviousDetails = new Element.Textbox('#textarea_FA56_t')
    concernsTrust = new Element.Select('#itm_FA58')
    concernsTrustDetails = new Element.Textbox('#textarea_FA58_t')
    concernsTrustPrevious = new Element.Select('#itm_FA60')
    concernsTrustPreviousDetails = new Element.Textbox('#textarea_FA60_t')
}
