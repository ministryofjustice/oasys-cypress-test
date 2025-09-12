import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainFullUserProfile extends Page {

    name = 'MaintainFullUserProfile'
    title = 'Maintain Full User Profile'

    disableProfile = new Element.Button('Disable Profile')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    userName = new Element.Textbox('#P9_OASYS_USER_CODE')
    probationProviderEstablishment = new Element.Textbox('#P9_TRUST_ESTABLISHMENT')
    forename1 = new Element.Textbox('#P9_USER_FORENAME_1')
    forename2 = new Element.Textbox('#P9_USER_FORENAME_2')
    surname = new Element.Textbox('#P9_USER_FAMILY_NAME')
    phone = new Element.Textbox('#P9_PHONE_NUMBER')
    email = new Element.Textbox('#P9_EMAIL_ADDRESS')
    office = new Element.Select('#P9_OFFICE')
    position = new Element.Textbox('#P9_POSITION')
    privacyControls = new Element.Select('#P9_RBAC_HIERARCHY')
    lau = new Element.Select('#P9_LDU')
    mainTeam = new Element.Select('#P9_DEFAULT_TEAM')
    defaultCountersigner = new Element.Lov('#P9_DEFAULT_COUNTERSIGNER_LABEL')
    signingRole = new Element.Select('#P9_SIGNING_ROLE')
    teams = new Element.Shuttle('PRO060_TEAMS')
    roles = new Element.Shuttle('PRO060_ROLES')
    frameworkRole = new Element.Select('#P9_FRAMEWORK_ROLE')
}
