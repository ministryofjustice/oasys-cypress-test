import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PullThroughObjectives extends Page {

    name = 'PullThroughObjectives'
    title = 'Pull Through Objectives'

    ok = new Element.Button('OK')
    close = new Element.Button('Close')
    confirmation = new Element.Text('Objective(s) Successfully pulled through.')
    objectiveDescColumn = new Element.Column(Element.ColumnType.Column, 'Objective Desc')
    selectColumn = new Element.Column(Element.ColumnType.CheckboxColumn, '')
}
