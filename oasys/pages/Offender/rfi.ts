import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Rfi extends Page {

    name = 'Rfi'
    title = 'RFI Form'
    menu: Menu = { type: 'Subform', level1: 'RFI' }

    save = new Element.Button('Save')
    send = new Element.Button('Send')
    complete = new Element.Button('Complete')
    close = new Element.Button('Close')
    typeOfRfi = new Element.Select<'Internal'|'External'|'Ad Hoc'>('#P1_TYPE_RFI_TYPE_ELM')
    internalProvider = new Element.Select('#P1_INT_REQ_CT_AREA_EST_CODE')
    users = new Element.Shuttle('#shuttleRFI030_INTERNAL')
    recipient = new Element.Select('#P1_EXT_REQ_RECIPIENT')
    adHocProvider = new Element.Select('#P1_ADHOC_CT_AREA_EST_CODE')
    internalUser = new Element.Lov('#P1_ADHOC_INFO_INTERNAL_LABEL')
    externalUser = new Element.Select('#P1_ADHOC_INFO_EXTERNAL')
    offenderName = new Element.Textbox('#P1_OFF_NAME')
    pnc = new Element.Textbox('#P1_OFF_PNC')
    probationCrn = new Element.Textbox('#P1_OFF_CMS_PROB_NUMBER')
    offenderProvider = new Element.Textbox('#P1_OFF_PRIMARY_LOCATION_AREA_DESC')
    dateRequested = new Element.Textbox<OasysDate>('#P1_RFI_DATE_REQUEST_MADE')
    requestedBy = new Element.Textbox('#P1_RFI_OASYS_USER_CODE_DESC')
    phoneNumber = new Element.Textbox('#P1_RFI_PHONE_NUMBER')
    emailAddress = new Element.Textbox('#P1_RFI_EMAIL_ADDRESS')
    returnBy = new Element.Textbox('#P1_RFI_DATE_RFI_DUE')
    dateReturned = new Element.Textbox<OasysDate>('#P1_RFI_DATE_RFI_RETURNED')
    dateProvided = new Element.Textbox<OasysDate>('#P1_RFI_DATE_PROVIDED')
    providedBy = new Element.Textbox('#P1_RFI_PROVIDED_BY')
    reasonForRequest = new Element.Select('#P1_RFI_PURPOSE_ASSESSMENT_ELM')
    specifically = new Element.Textbox('#P1_RFI_SPECIFIC_INFO_REQUEST')
    specificallyResponse = new Element.Textbox('#P1_RFI_SPECIFIC_INFO_RESPONSE')
    offendingRelatedNeeds = new Element.Textbox('#P1_RFI_OFFENDING_NEEDS_RESPONSE')
    riskOfSeriousHarm = new Element.Textbox('#P1_RFI_RISK_OF_HARM_RESPONSE')
    progressAgainstSentencePlan = new Element.Textbox('#P1_RFI_PLAN_PROGRESS_RESPONSE')
    anyOtherInformation = new Element.Textbox('#P1_RFI_OTHER_INFO_RESPONSE')
}
