import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OffencesLov extends Page {

    name = 'OffencesLOV'

    close = new Element.Button('Close')
    findOffence = new Element.Link('Find Offence')
    selectionType = new Element.Select('#P2_SELECTION_TYPE')
    selection = new Element.Select('#P2_OFFENCE_ELM')
    search = new Element.Button('Search')
    reset = new Element.Button('Reset')
    offenceColumn = new Element.Column(Element.ColumnType.Column, 'Offence')
    codeColumn = new Element.Column(Element.ColumnType.Column, 'Code')
    subcodeColumn = new Element.Column(Element.ColumnType.Column, 'Subcode')
}
