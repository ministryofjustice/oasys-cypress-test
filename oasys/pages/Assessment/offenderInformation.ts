import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class OffenderInformation extends BaseAssessmentPage {

    name = 'OffenderInformation'
    title = 'Case ID - Offender Information'
    menu: Menu = { type: 'Floating', level1: 'Case ID', level2: 'Offender Information' }

    surname = new Element.Textbox('#P2_FAMILY_NAME')
    forenames = new Element.Textbox('#P2_FORENAMES')
    surnameAliases = new Element.Textbox('#P2_ALIAS_FAMILY_NAME')
    forenameAliases = new Element.Textbox('#P2_ALIAS_FORENAMES')
    dob = new Element.Textbox<OasysDate>('#P2_DATE_OF_BIRTH')
    dobAliases = new Element.Textbox<OasysDate>('#P2_ALIAS_DATE_OF_BIRTH')
    gender = new Element.Textbox('#P2_GENDER_TEXT')
    religion = new Element.Select('#P2_RELIGION_ELM')
    religionOther = new Element.Textbox('#P2_RELIGION_OTHER')
    pnc = new Element.Textbox('#P2_PNC')
    cro = new Element.Textbox('#P2_CRO_NUMBER')
    probationCrn = new Element.Textbox('#P2_CMS_PROB_NUMBER')
    nomisId = new Element.Textbox('#P2_CMS_PRIS_NUMBER')
    prisonNumber = new Element.Textbox('#P2_PRISON_NUMBER')
    location = new Element.Textbox('#P2_PRIMARY_LOCATION')
    currentAddressLine1 = new Element.Textbox('#P2_CURRENT_ADDRESS_LINE_1')
    currentAddressLine2 = new Element.Textbox('#P2_CURRENT_ADDRESS_LINE_2')
    currentAddressLine3 = new Element.Textbox('#P2_CURRENT_ADDRESS_LINE_3')
    currentAddressLine4 = new Element.Textbox('#P2_CURRENT_ADDRESS_LINE_4')
    currentAddressLine5 = new Element.Textbox('#P2_CURRENT_ADDRESS_LINE_5')
    currentAddressLine6 = new Element.Textbox('#P2_CURRENT_ADDRESS_LINE_6')
    currentPostcode = new Element.Textbox('#P2_CURRENT_POST_CODE')
    telephone = new Element.Textbox('#P2_CURRENT_TELEPHONE_NUMBER')
    ethnicCategory = new Element.Select('#P2_ETHNIC_CATEGORY_CODE_ELM')
    preferredWrittenLanguage = new Element.Select('#P2_PREF_WRITE_LANGUAGE_ELM')
    preferredWrittenLanguageOther = new Element.Textbox('#P2_PRF_WRT_LNG_OFTXT')
    preferredSpokenLanguage = new Element.Select('#P2_PREF_SPOKEN_LANGUAGE_ELM')
    preferredSpokenLanguageOther = new Element.Textbox('#P2_PRF_SPKN_LNG_OFTXT')
    interpreterRequired = new Element.Select('#P2_INTERPRETER_REQUIRED_IND')
    purposeOfAssessment = new Element.Textbox('#P2_PURPOSE_ASSESSMENT_TEXT')
    assessorName = new Element.Textbox('#P2_ASSESSOR_NAME')
    assessorPosition = new Element.Textbox('#P2_ASSESSOR_POSITION')
    assessorTelephone = new Element.Textbox('#P2_ASSESSOR_PHONE_NUMBER')
    providerOrPrison = new Element.Textbox('#P2_ORIGINATING_AREAEST')
    lau = new Element.Select('#P2_ASSESSOR_OFFICE')
    team = new Element.Select('#P2_ASSESSOR_TEAM')
    countersignerOrSupervisor = new Element.Textbox('#P2_COUNTERSIGNER_NAME')
    requestedBy = new Element.Textbox('#P2_REQUESTED_BY')
    dateAssessmentCompleted = new Element.Textbox<OasysDate>('#P2_DATE_COMPLETED')
    ppo = new Element.Select('#P2_OFFDR_IDENT_PERSIST_IND')
    careOrder = new Element.Select('#P2_LOOKED_AFTER')
    dateAssessmentReportRequested = new Element.Textbox<OasysDate>('#P2_DATE_ASSESSMENT_REQST')
    signingHistory = new SigningHistory('R3160204539970995', 'Signing History')
}


export class SigningHistory extends Element.Table {

    action = new Element.Column(Element.ColumnType.Column, `#A_${this.id}`, this.id)
    who = new Element.Column(Element.ColumnType.Column, `#B_${this.id}`, this.id)
    date = new Element.Column(Element.ColumnType.Column, `#C_${this.id}`, this.id)
    comment = new Element.Column(Element.ColumnType.Column, `#D_${this.id}`, this.id)
}
