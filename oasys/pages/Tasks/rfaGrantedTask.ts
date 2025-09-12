import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RfaGrantedTask extends Page {

    name = 'RfaGrantedTask'
    title = 'Task Description'

    printTask = new Element.Button('Print Task')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    taskDescription = new Element.Textbox('#P1_HDR_TASK_DESCRIPTION')
    surname = new Element.Textbox('#P1_OFF_1_FAMILY_NAME')
    forename = new Element.Textbox('#P1_OFF_1_FORENAME_1')
    dateOfBirth = new Element.Textbox<OasysDate>('#P1_OFF_1_DATE_OF_BIRTH')
    pnc = new Element.Textbox('#P1_OFF_1_PNC')
    physicalLocation = new Element.Textbox('#P1_OFF_1_PHYSICAL_LOCATION_AREA')
    openOffenderDetails = new Element.Button('#P1_OFF_1_BT_OFFENDER_DETAIL')
    rfaExpiry = new Element.Textbox('#P1_EXPIRY_PERIOD')
    dateRaised = new Element.Textbox<OasysDate>('#P1_FTR_DATE_TASK_CREATED')
}
