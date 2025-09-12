import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainHelpText extends Page {

    name = 'MaintainHelpText'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Help Text' }

    close = new Element.Button('Close')
    helpItemsColumn = new Element.Column(Element.ColumnType.Column, 'Help Items')
    globalColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Global')
    localColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Local')
}
