import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CompletionCheck extends Page {

    name = 'CompletionCheck'
    title = 'Completion Check (Part 1)'
    menu: Menu = { type: 'Floating', level1: 'Completion Check' }

    signNow = new Element.Button('Sign Now')
    bq1 = new Element.Textbox('#itm_TR_BCS144')
    bq2 = new Element.Textbox('#itm_TR_BCS145')
}
