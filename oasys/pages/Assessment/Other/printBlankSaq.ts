import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PrintBlankSaq extends Page {

    name = 'PrintBlankSAQ'
    title = 'Print Blank SAQ'
    menu: Menu = { type: 'Main', level1: 'Print Template', level2: 'Print Blank SAQ' }

    selectLanguage = new Element.Select('#P100_SAQ_FILENAME_LOV')
    print = new Element.Button('Print')
    cancel = new Element.Button('Cancel')
}
