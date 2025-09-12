import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Intbdtto extends Page {

    name = 'Intbdtto'
    title = 'Information not to be disclosed to the Offender'

    print = new Element.Button('Print')
    delete = new Element.Button('Delete')
    confirmDelete = new Element.Button('Confirm Delete')
    markAsSuperseded = new Element.Button('Mark As Superseded')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    userDetails = new Element.Text('#P50_NDS_NAME_DISPLAY')
    informationNotesEntry = new Element.Textbox('#P50_INFO_WITHHELD_OFFDR')
    informationNotesDisplay = new Element.Text('#P50_INFO_WITHHELD_OFFDR_DISPLAY')
    supersededNotesEntry = new Element.Textbox('#P50_OBSOLETED_REASON')
    supersededNotesDisplay = new Element.Text('#P50_OBSOLETED_REASON_DISPLAY')
    supersededUserDetails = new Element.Text('#P50_NDS_SUPERSEDE_NAME_DISPLAY')
    deletionReason = new Element.Textbox('#P50_DELETION_REASON')
}
