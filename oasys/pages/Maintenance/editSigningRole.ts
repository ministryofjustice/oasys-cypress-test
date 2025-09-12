import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class EditSigningRole extends Page {

    name = 'EditSigningRole'
    title = 'Edit Signing Role'

    deleteRole = new Element.Button('Delete Role')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    signingRoleName = new Element.Textbox('#P10_REF_ROLE_DESC')
    signingTierLevel = new Element.Select('#P10_SIGNING_TIER_LEVEL')
    signingRiskLevel = new Element.Select('#P10_SIGNING_RISK_LEVEL')
    signingExemptionLevel = new Element.Select('#P10_SIGNING_EXEMPTION_LEVEL')
    psrSigningRiskLevel = new Element.Select('#P10_SIGNING_PSR_RISK_LEVEL')
    psrSigningTierLevel = new Element.Select('#P10_SIGNING_PSR_TIER_LEVEL')
    signingTransferRequestLevel = new Element.Select('#P10_SIGNING_TRANSFER_REQUEST_LEVEL')
}
