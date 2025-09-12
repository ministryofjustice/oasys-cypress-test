import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class NonWorkingDays extends Page {

    name = 'NonWorkingDays'
    title = 'Non-Working Days Maintenance'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Non-Working Days' }

    close = new Element.Button('Close')
    nonWorkingDate = new Element.Textbox<OasysDate>('#P7_NON_WORKING_DAY')
    description = new Element.Textbox('#P7_NON_WORKING_DATE_DESC')
    setAsNonWorkingDay = new Element.Button('Set As Non-Working')
}
