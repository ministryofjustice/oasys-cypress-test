import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OfficeMaintenance extends Page {

    name = 'OfficeMaintenance'
    title = 'Office Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Office Details' }

    close = new Element.Button('Close')
    newOffice = new Element.Button('New Office')
    officeNameColumn = new Element.Column(Element.ColumnType.Column, 'Office Name')
    activeColumn = new Element.Column(Element.ColumnType.Column, 'Active')
}
