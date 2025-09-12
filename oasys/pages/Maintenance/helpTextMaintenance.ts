import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class HelpTextMaintenance extends Page {

    name = 'HelpTextMaintenance'

    preview = new Element.Button('Preview')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    itemDescription = new Element.Textbox('#P20_ITEM_DESCRIPTION')
    introductionHelpText = new Element.TextEditor('#P20_INTRO_DRAFT_LABEL')
    globalHelpText = new Element.TextEditor('#P20_GLOBAL_HELP_DRAFT_LABEL')
    publish = new Element.Button('Publish')
    copyPublished = new Element.Button('Copy Published')
}
