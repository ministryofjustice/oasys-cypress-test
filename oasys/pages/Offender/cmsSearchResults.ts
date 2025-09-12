import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CmsSearchResults extends Page {

    name = 'CmsSearchResults'
    title = 'CMS Search Results'

    close = new Element.Button('Close')
    probationCrnColumn = new Element.Column(Element.ColumnType.Column, 'Case Reference Number')
    cmsEventNumberColumn = new Element.Column(Element.ColumnType.Column, 'Event Number')
    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname')
    forename1Column = new Element.Column(Element.ColumnType.Column, 'Forename 1')
    genderColumn = new Element.Column(Element.ColumnType.Column, 'Gender')
    dateOfBirthColumn = new Element.Column(Element.ColumnType.Column, 'Date Of Birth')
    sentenceDateColumn = new Element.Column(Element.ColumnType.Column, 'Sentence Date')
    sentenceColumn = new Element.Column(Element.ColumnType.Column, 'Sentence')
}
