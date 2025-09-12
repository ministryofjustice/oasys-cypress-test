import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class IntbdttoTab extends Page {

    name = 'IntbdttoTab'

    enterIntbdtto = new Element.Button('Enter INTBDTTO')
    statusColumn = new Element.Column(Element.ColumnType.Column, 'Status')
    dateColumn = new Element.Column(Element.ColumnType.Column, 'Date')
    nameColumn = new Element.Column(Element.ColumnType.Column, 'Name')
    notesColumn = new Element.Column(Element.ColumnType.Column, 'Notes')
}
