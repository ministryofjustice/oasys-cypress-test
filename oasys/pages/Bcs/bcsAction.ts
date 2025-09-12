import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class BcsAction extends Page {

    name = 'BCSAction'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    resettlementPathwayItem = new Element.Select('#P4_PATHWAY_ITEM')
    actionRequired = new Element.Textbox('#P4_OBJECTIVE_TEXT')
    serviceLevel = new Element.Select('#P4_SERVICE_LEVEL')
    personResponsible = new Element.Textbox('#P4_WHO_WILL_DO_WORK_TEXT')
    dateOpened = new Element.Textbox<OasysDate>('#P4_DATE_OPENED')
    completionDate = new Element.Textbox<OasysDate>('#P4_DATE_COMPLETED')
    complete = new Element.Select('#P4_PROBLEM_AREA_COMP_IND')
    delete = new Element.Button('Delete')
    addAnotherAction = new Element.Button('Add Another Action')
}
