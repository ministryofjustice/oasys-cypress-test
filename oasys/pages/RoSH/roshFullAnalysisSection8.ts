import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshFullAnalysisSection8 extends BaseAssessmentPage {

    name = 'RoshFullAnalysisSection8'
    title = 'Risk of Serious Harm Full Analysis'
    menu: Menu = { type: 'Floating', level1: 'RoSH Full Analysis', level2: 'Section 8' }

    concernsSuicide = new Element.Select('#itm_FA31')
    concernsSelfHarm = new Element.Select('#itm_FA32')
    suicideHarmDetails = new Element.Textbox('#textarea_FA33')
    acct = new Element.Select('#itm_FA34')
    bookNumber = new Element.Textbox('#itm_FA35')
    concernsSuicidePast = new Element.Select('#itm_FA36')
    concernsSelfHarmPast = new Element.Select('#itm_FA37')
    suicideHarmDetailsPast = new Element.Textbox('#textarea_FA38')
    concernsCustody = new Element.Select('#itm_FA39')
    concernsHostel = new Element.Select('#itm_FA40')
    custodyHostelDetails = new Element.Textbox('#textarea_FA41')
    concernsCustodyPrevious = new Element.Select('#itm_FA42')
    concernsHostelPrevious = new Element.Select('#itm_FA43')
    custodyHostelDetailsPrevious = new Element.Textbox('#textarea_FA44')
    concernsVulnerability = new Element.Select('#itm_FA45')
    vulnerabilityDetails = new Element.Textbox('#textarea_FA45_t')
    concernsVulnerabilityPrevious = new Element.Select('#itm_FA47')
    vulnerabilityDetailsPrevious = new Element.Textbox('#textarea_FA47_t')
    roshOthers = new Element.Select('#itm_FA49')
    riskDetails = new Element.Textbox('#textarea_FA49_t')
}
