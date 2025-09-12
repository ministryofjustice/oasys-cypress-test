import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection7 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection7'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 7' }

    EnterChildDetails = new Element.Button('Enter Child Details')
}
