import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ChangeSentencePlan extends Page {

    name = 'ChangeSentencePlan'
    title = 'Administration Functions - Change Sentence Plan'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Change Sentence Plan Type' }

    save = new Element.Button('Save')
    cancel = new Element.Button('Cancel')
    review = new Element.Link('Review')
    initial = new Element.Link('Initial')
    psrOutline = new Element.Link('PSR Outline')
}
