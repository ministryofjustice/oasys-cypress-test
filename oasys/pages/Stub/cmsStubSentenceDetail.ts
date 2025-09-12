import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CmsStubSentenceDetail extends Page {

    name = 'CMSStubSentenceDetail'
    title = 'Training - CMS Stub'

    delete = new Element.Button('Delete')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    detailCategory = new Element.Select('#P500_SENTENCE_ATTRIBUTE_CAT')
    detailType = new Element.Select('#P500_SENTENCE_ATTRIBUTE_ELM')
    lengthHours = new Element.Textbox('#P500_LENGTH_IN_HOURS')
    lengthMonths = new Element.Textbox('#P500_LENGTH_IN_MONTHS')
    detailDescription = new Element.Textbox('#P500_ACTIVITY_DESC')
    displayOrder = new Element.Textbox('#P500_DISPLAY_SORT')
}
