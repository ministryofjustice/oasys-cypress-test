import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CmsStubOffence extends Page {

    name = 'CMSStubOffence'
    title = 'Training - CMS Stub'

    close = new Element.Button('Close')
    save = new Element.Button('Save')
    offence = new Element.Textbox('#P400_OFFENCE_GROUP_CODE')
    offenceDescription = new Element.Textbox('#LOVDSC_P400_OFFENCE_GROUP_CODE')
    subcode = new Element.Textbox('#P400_OFFENCE_SUB_CODE')
    subcodeDescription = new Element.Textbox('#LOVDSC_P400_OFFENCE_SUB_CODE')
    additionalOffence = new Element.Checkbox('#P400_ADDITIONAL_OFFENCE_IND_0')
}
