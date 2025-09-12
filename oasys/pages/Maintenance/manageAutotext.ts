import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ManageAutotext extends Page {

    name = 'ManageAutotext'
    title = 'Manage Auto Text'

    close = new Element.Button('Close')
    autotextType = new Element.Select('#P3_AUTOTEXT_TYPE')
    sectionColumn = new Element.Column(Element.ColumnType.Column, 'Section')
    add = new Element.Button('Add')
}
