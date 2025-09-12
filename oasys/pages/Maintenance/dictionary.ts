import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Dictionary extends Page {

    name = 'Dictionary'
    title = 'Dictionary'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Dictionary' }

    close = new Element.Button('Close')
    searchWord = new Element.Textbox('#P7_SEARCH_WORD')
    search = new Element.Button('Search')
    addWord = new Element.Textbox('#P7_ADD_WORD')
    addWordButton = new Element.Button('Add Word')
    wordColumn = new Element.Column(Element.ColumnType.Column, '')
}
