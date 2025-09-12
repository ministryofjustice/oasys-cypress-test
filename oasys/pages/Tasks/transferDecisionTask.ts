import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class TransferDecisionTask extends Page {

    name = 'TransferDecisionTask'
    title = 'Task Description'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    taskDescription = new Element.Textbox('#P1_HDR_TASK_DESCRIPTION')
    surname = new Element.Textbox('#P1_OFF_1_FAMILY_NAME')
    forename = new Element.Textbox('#P1_OFF_1_FORENAME_1')
    dateOfBirth = new Element.Textbox<OasysDate>('#P1_OFF_1_DATE_OF_BIRTH')
    pnc = new Element.Textbox('#P1_OFF_1_PNC')
    physicalLocation = new Element.Textbox('#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    openOffenderDetails = new Element.Button('#P1_OFF_1_BT_OFFENDER_DETAIL')
    markasUnderInvestigation = new Element.Select('#P1_RES_UNDER_INVESTIG_IND')
    rejectionReason = new Element.Textbox('#P1_RES_TRF_GRANT_RE_COMMENTS')
    requestingName = new Element.Textbox('#P1_PARENT_CONTACT_NAME')
    openRequestingDetails = new Element.Button('#P1_REQ_BT_REQUESTING_DETAIL')
    requestingProbationProvider = new Element.Textbox('#P1_PARENT_AREA')
    requestorComments = new Element.Textbox('#P1_PARENT_REQ_COMMENT')
    dateRaised = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_CREATED')
    dateDue = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_REQUIRED')
    reassignToLau = new Element.Select('#P1_REA_REASSIGN_LDU')
    reassignToTeam = new Element.Select('#P1_REA_REASSIGN_TEAM')
    reassignToUser = new Element.Lov('#P1_REA_REASSIGN_TASK_LABEL')
    grantTransfer = new Element.Button('#P1_GBT_GRANT')
    denyTransfer = new Element.Button('#P1_GBT_DENY')
}
