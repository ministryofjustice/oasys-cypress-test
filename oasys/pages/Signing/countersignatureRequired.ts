import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CountersignatureRequired extends Page {

    name = 'CountersignatureRequired'

    confirm = new Element.Button('Confirm')
    cancel = new Element.Button('Cancel')
    countersigner = new Element.Lov('#P3_COUNTERSIGN_LOV_LABEL')
    comments = new Element.Textbox('#P3_ASSESSOR_COMMENTS')
}
