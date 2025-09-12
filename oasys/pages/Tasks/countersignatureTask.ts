import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CountersignatureTask extends Page {

    name = 'CountersignatureTask'
    title = 'Task Description'

    printTask = new Element.Button('Print task')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    taskDescription = new Element.Textbox('#P1_HDR_TASK_DESCRIPTION')
    surname = new Element.Textbox('#P1_OFF_1_FAMILY_NAME')
    statusIcons = new Element.IconContainer('#P1_OFF_1_ICON')
    forename = new Element.Textbox('#P1_OFF_1_FORENAME_1')
    dateOfBirth = new Element.Textbox<OasysDate>('#P1_OFF_1_DATE_OF_BIRTH')
    pnc = new Element.Textbox('#P1_OFF_1_PNC')
    physicalLocation = new Element.Textbox('#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    openOffenderDetails = new Element.Button('#P1_OFF_1_BT_OFFENDER_DETAIL')
    assessorCountersigner = new Element.Textbox('#P1_RES_ASSESSOR_NAME')
    assessorCountersignerComments = new Element.Textbox('#P1_RES_ASSESSOR_COMMENTS')
    openAssessment = new Element.Button('#P1_ASS_BT_OPEN_ASSESMENT')
    dateRaised = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_CREATED')
    dateDue = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_REQUIRED')
    reassignToLau = new Element.Select('#P1_REA_REASSIGN_LDU')
    reassignToTeam = new Element.Select('#P1_REA_REASSIGN_TEAM')
    reassignToUser = new Element.Lov('#P1_REA_REASSIGN_TASK_LABEL')
}
