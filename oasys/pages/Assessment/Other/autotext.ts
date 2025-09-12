import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Autotext extends Page {

    name = 'Autotext'

    close = new Element.Button('Close')
    personal = new Element.Link('Personal')
    global = new Element.Link('Global')
    item = new Element.Text('#P200_ITEM_NAME')
}
