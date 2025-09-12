import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ReferenceData extends Page {

    name = 'ReferenceData'
    title = 'Core Reference Data Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Reference Data' }

    referenceCategory = new Element.Select('#P7_REF_CATEGORY')
    codeColumn = new Element.Column(Element.ColumnType.Column, 'Code')
    close = new Element.Button('Close')
}
