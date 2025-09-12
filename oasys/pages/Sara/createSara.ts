import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CreateSara extends Page {

    name = 'CreateSARA'

    create = new Element.Button('Create')
    cancel = new Element.Button('Cancel')
    yes = new Element.Button('Yes')
    no = new Element.Button('No')
}
