import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class BcsWorkInProgress extends Page {

    name = 'BCSWorkInProgress'
    title = 'ASS050 - WIP BCP'

    errorMessage = new Element.Text('#P10_TEXT_WIP')
    cancel = new Element.Button('Cancel')
}
