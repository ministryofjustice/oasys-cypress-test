import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AmendRoshaDate extends Page {

    name = 'AmendRoshaDate'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Amend Date of Commencement of Community Sentence or Earliest Possible Release from Custody' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    o1_38 = new Element.Textbox<OasysDate>('#P3_DATE_IN_COMMUNITY')
    auditText = new Element.Textbox('#P3_QU_1_38_T')
    rsrScore = new Element.Textbox('#P3_RSR')
}
