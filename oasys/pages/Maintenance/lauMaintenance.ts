import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class LauMaintenance extends Page {

    name = 'LAUMaintenance'
    title = 'LAU Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'LAU Details' }

    close = new Element.Button('Close')
    newLau = new Element.Button('New LAU')
    launameColumn = new Element.Column(Element.ColumnType.Column, 'Office Name')
    activeColumn = new Element.Column(Element.ColumnType.Column, 'Active')
}
