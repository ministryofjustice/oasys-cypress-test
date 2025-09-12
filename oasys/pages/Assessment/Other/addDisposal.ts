import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AddDisposal extends Page {

    name = 'AddDisposal'
    title = 'Assessment questions for 1 - Offence & Sentence Information'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Add Disposal' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    currentEvent = new Element.Link('Current Event')
    offence = new Element.Textbox('#P6_CT_OFFENCE_CODE')
    offenceDescription = new Element.Textbox('#LOVDSC_P6_CT_OFFENCE_CODE')
    subcode = new Element.Textbox('#P6_CT_OFFENCE_SUBCODE')
    subcodeDescription = new Element.Textbox('#LOVDSC_P6_CT_OFFENCE_SUBCODE')
    count = new Element.Textbox('#P6_COUNT_OF_OFFENCES')
    offenceDate = new Element.Textbox<OasysDate>('#P6_OFFENCE_DATE')
    sentence = new Element.Select('#P6_SENTENCE_CODE')
    disqualificationOrder = new Element.Select('#P6_DISQUALIFICATION_ORDER')
    custodyInMonths = new Element.Textbox('#P6_SENTENCE_LENGTH_CRO_M')
    sentenceLengthInDays = new Element.Textbox('#P6_SENTENCE_LENGTH_CUST_DAYS')
    communityPunishmentHours = new Element.Textbox('#P6_SENTENCE_LENGTH_CPO_HOURS')
    sentenceDate = new Element.Textbox<OasysDate>('#P6_SENTENCE_DATE')
    courtProximity = new Element.Select('#P6_COURT_PROXIMITY')
    courtName = new Element.Select('#P6_COURT_NAME')
    courtType = new Element.Textbox('#P6_COURT_TYPE')
    additionalRequirements1 = new Element.Select('#P6_ADDL_SENTENCE_REQUIRE_ELM1')
    additionalRequirements2 = new Element.Select('#P6_ADDL_SENTENCE_REQUIRE_ELM2')
    additionalRequirements3 = new Element.Select('#P6_ADDL_SENTENCE_REQUIRE_ELM3')
    additionalRequirements4 = new Element.Select('#P6_ADDL_SENTENCE_REQUIRE_ELM4')
    additionalRequirements5 = new Element.Select('#P6_ADDL_SENTENCE_REQUIRE_ELM5')
    specificInterventions1 = new Element.Select('#P6_INTERVENTION_ELM1')
    specificInterventions2 = new Element.Select('#P6_INTERVENTION_ELM2')
    specificInterventions3 = new Element.Select('#P6_INTERVENTION_ELM3')
    sentenceAdditionalLicenceConditions = new Element.Textbox('#P6_SNT_ALIC_CNDS2_LGCYDAT')
}
