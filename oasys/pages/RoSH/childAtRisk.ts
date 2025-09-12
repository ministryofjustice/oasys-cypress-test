import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class ChildAtRisk extends Page {

    name = 'ChildAtRisk'
    menu: Menu = { type: 'Subform', level1: 'Enter Child Details' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    childName = new Element.Textbox('#P3_NAME_OF_CHILD')
    dateOfBirth = new Element.Textbox<OasysDate>('#P3_DATE_OF_BIRTH')
    age = new Element.Select('#P3_AGE_OF_CHILD_ELM')
    gender = new Element.Select('#P3_GENDER_ELM')
    address = new Element.Textbox('#P3_ADDRESS_OF_CHILD')
    relationship = new Element.Select('#P3_REL_TO_INDIVIDUAL_ELM')
    relationshipOther = new Element.Textbox('#P3_REL_TO_INDIVIDUAL_OTHER')
    contact = new Element.Select('#P3_HAS_OR_SEEK_CONTACT')
    worried = new Element.Select('#P3_WORRIED_ABOUT')
    worriedAbout = new Element.Textbox('#P3_WORRIED_ABOUT_TEXT')
    knownToServices = new Element.Select('#P3_EVER_KNOWN_CHILD_SERVICES')

    earlyHelpCurrent = new Element.Checkbox('#P3_EARLY_HELP_0')
    earlyHelpPrevious = new Element.Checkbox('#P3_EARLY_HELP_1')
    childInNeedCurrent = new Element.Checkbox('#P3_CHILD_NEED_0')
    childInNeedPrevious = new Element.Checkbox('#P3_CHILD_NEED_1')
    cppCurrent = new Element.Checkbox('#P3_CHILD_PROT_PLAN_0')
    cppPrevious = new Element.Checkbox('#P3_CHILD_PROT_PLAN_1')

    currentNeglect = new Element.Checkbox('#itm494C')
    currentPhysical = new Element.Checkbox('#itm496C')
    currentSexual = new Element.Checkbox('#itm498C')
    currentEmotional = new Element.Checkbox('#itm500C')
    previousNeglect = new Element.Checkbox('#itm494P')
    previousPhysical = new Element.Checkbox('#itm496P')
    previousSexual = new Element.Checkbox('#itm498P')
    previousEmotional = new Element.Checkbox('#itm500P')
    briefDetails = new Element.Textbox('#P3_CATG_ABUSE_DETAILS')
    shareWithServices = new Element.Select('#P3_SHARE_WITH_CHILD_SERVICES')
    recordRationale = new Element.Textbox('#P3_SHARE_CHILD_SERV_DETAILS')

    delete = new Element.Button('Delete')
    addAnotherChild = new Element.Button('Add Another Child at Risk')
}
