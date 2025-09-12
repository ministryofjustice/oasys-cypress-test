import * as Element from 'classes/elements'
import { Page } from 'classes/page'

export class AliasTab extends Page {

    name = 'AliasTab'

    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname')
    forename1Column = new Element.Column(Element.ColumnType.Column, 'Forename 1')
    forename2Column = new Element.Column(Element.ColumnType.Column, 'Forename 2')
    dateOfBirthColumn = new Element.Column(Element.ColumnType.Column, 'Date Of Birth')
    addNewAlias = new Element.Button('Add New Alias')
}
