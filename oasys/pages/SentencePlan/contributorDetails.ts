import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ContributorDetails extends Page {

    name = 'ContributorDetails'
    menu: Menu = { type: 'Subform', level1: 'Enter Contributor Details' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    contributorName = new Element.Textbox('#P3_CONTRIBUTOR_NAME')
    role = new Element.Textbox('#P3_CONTRIBUTOR_ROLE')
    attendBoard = new Element.Select('#P3_SENT_PLAN_BOARD_ATTD_IND')
    delete = new Element.Button('Delete')
    addAnotherContributor = new Element.Button('Add Another Contributor')
}
