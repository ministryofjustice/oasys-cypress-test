import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PrintSentencePlan extends Page {

    name = 'PrintSentencePlan'

    currentObjectivesColumn = new Element.Column(Element.ColumnType.Column, '#SECTION_NAME_R10389525023337893')
    includeColumn = new Element.Column(Element.ColumnType.CheckboxColumn, '#CHECK_BOX_R10389525023337893')
    print = new Element.Button('Print')
    cancel = new Element.Button('Cancel')
}
