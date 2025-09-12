﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Rfa extends Page {

    name = 'Rfa'
    title = 'Request for Access'

    submit = new Element.Button('Submit')
    cancel = new Element.Button('Cancel')
    surname = new Element.Textbox('#P60_FAMILY_NAME')
    pnc = new Element.Textbox('#P60_PNC')
    statusIcons = new Element.IconContainer('#P60_ICONS')
    forename = new Element.Textbox('#P60_FORENAME_1')
    mergePnc = new Element.Textbox('#P60_MERGE_PNC_NUMBER')
    otherForenames = new Element.Textbox('#P60_OTHER_FORENAMES')
    cro = new Element.Textbox('#P60_CRO_NUMBER')
    owningAreaEst = new Element.Textbox('#P60_PRIMARY_LOC_AREA_DESC')
    probationCrn = new Element.Textbox('#P60_CMS_PROB_NUMBER')
    location = new Element.Textbox('#P60_PHYSICAL_LOCATION')
    dateOfBirth = new Element.Textbox<OasysDate>('#P60_DATE_OF_BIRTH')
    prisonNomisNo = new Element.Textbox('#P60_CMS_PRIS_NUMBER')
    deceasedInd = new Element.Textbox('#P60_DECEASED_IND')
    gender = new Element.Textbox('#P60_GENDER_ELM')
    prisonLidsNo = new Element.Textbox('#P60_PRISON_NUMBER')
    ethnicCategory = new Element.Textbox('#P60_ETHNIC_CAT_ELM_DESC')
    rfaReason = new Element.Select('#P60_RFA_REASON')
    otherReason = new Element.Textbox('#P60_RFA_REASON_OTHER')
    requestorComments = new Element.Textbox('#P60_REQUESTER_COMMENTS')
    rfaLength = new Element.Textbox('#P60_RFA_EXPIRY')
    trustyText = new Element.Text('#P60_STATIC_TEXT_TRUSTY')
    nonTrustyText = new Element.Textbox('#P60_STATIC_TEXT')
    userTeam = new Element.Select('#P60_USER_TEAM')
    users = new Element.Shuttle('#shuttleOFF030_USERS')
}
