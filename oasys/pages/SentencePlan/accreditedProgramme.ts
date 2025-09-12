import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AccreditedProgramme extends Page {

    name = 'AccreditedProgramme'
    menu: Menu = { type: 'Subform', level1: 'New Programme' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    programmeAttended = new Element.Select('#P4_ACC_PROG_ELM')
    completed = new Element.Select('#P4_COMPLETED_IND')
    objectivesAchieved = new Element.Select('#P4_PROGRAMME_STATUS_ELM')
    reportAvailable = new Element.Select('#P4_REPORT_AVAILABLE_IND')
    delete = new Element.Button('Delete')
    addAnother = new Element.Button('Add Another Accredited Programme')
}
