import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CmsStubAlias extends Page {

    name = 'CMSStubAlias'
    title = 'Training - CMS Stub'

    delete = new Element.Button('Delete')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    surname = new Element.Textbox('#P300_ALIAS_FAMILY_NAME')
    forename1 = new Element.Textbox('#P300_ALIAS_FORENAME_1')
    forename2 = new Element.Textbox('#P300_ALIAS_FORENAME_2')
    gender = new Element.Select('#P300_ALIAS_GENDER_ELM')
    dateOfBirth = new Element.Textbox<OasysDate>('#P300_ALIAS_DATE_OF_BIRTH')
}
