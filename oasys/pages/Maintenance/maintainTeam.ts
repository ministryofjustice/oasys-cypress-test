import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainTeam extends Page {

    name = 'MaintainTeam'
    title = 'Maintain Team'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    lAU = new Element.Select('#P10_DIVISION_CODE')
    teamName = new Element.Textbox('#P10_TEAM_NAME')
    contactTelephoneNumber = new Element.Textbox('#P10_CONTACT_NUMBER')
    emailAddress = new Element.Textbox('#P10_EMAIL_ADDRESS')
    status = new Element.Radiogroup('#P10_ACTIVE')
    usersInTeam = new Element.Shuttle('#shuttlePRO040_TEAM')
}
