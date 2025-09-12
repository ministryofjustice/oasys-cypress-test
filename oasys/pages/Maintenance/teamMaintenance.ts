import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class TeamMaintenance extends Page {

    name = 'TeamMaintenance'
    title = 'Team Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Team Details' }

    close = new Element.Button('Close')
    selectLau = new Element.Select('#P7_LDU')
    newTeam = new Element.Button('New Team')
    search = new Element.Button('Search')
    teamNameColumn = new Element.Column(Element.ColumnType.Column, 'Team Name')
    activeColumn = new Element.Column(Element.ColumnType.Column, 'Active')
}
