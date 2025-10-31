import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { SentencePlan } from './sentencePlan'

export class RspSection3to63 extends SentencePlan {

    name = 'RSPSection3to63'
    title = 'Review Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Review Sentence Plan', level2: 'Section 3 to 6.3' }

    motivation = new Element.Textbox('#XI_itm_12_8')
    capacityChanged = new Element.Select('#itm_RP_28')
    motivationSelect = new Element.Select('#itm_RP_27')
    capacityChangedHow = new Element.Textbox('#textarea_RP_29')
    discriminationWorkDone = new Element.Textbox('#textarea_RP_38')
    discriminationWorkRequired = new Element.Textbox('#textarea_RP_39')
    newProgramme = new Element.Button('New Programme')
    programmeColumn = new Element.Column(Element.ColumnType.Column, 'Programme attended eg R& R')
    completedColumn = new Element.Column(Element.ColumnType.Column, 'Completed')
    objectivesStatusColumn = new Element.Column(Element.ColumnType.Column, 'Programme objectives fully achieved, partly achieved, not achieved')
    reportColumn = new Element.Column(Element.ColumnType.Column, 'Report available')
    deleteColumn = new Element.Column(Element.ColumnType.ButtonColumn, 'Delete')
}
