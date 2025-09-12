import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainAutotext extends Page {

    name = 'MaintainAutotext'
    title = 'Maintain Auto Text'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Auto Text' }

    close = new Element.Button('Close')
    autotextSelect = new Element.Select('#P2_MENU_ITEM')
    sectionColumn = new Element.Column(Element.ColumnType.Column, 'Section')
    itemColumn = new Element.Column(Element.ColumnType.Column, 'Item')
    globalColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Global')
    personalColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Personal')
}
