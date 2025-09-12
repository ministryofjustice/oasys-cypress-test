import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class SigningRoles extends Page {

    name = 'SigningRoles'
    title = 'Maintain Signing Roles'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Signing Roles' }

    close = new Element.Button('Close')
    enterNewRole = new Element.Button('Enter New Role')
    roleNameColumn = new Element.Column(Element.ColumnType.Column, 'Role Name')
    tierLevelColumn = new Element.Column(Element.ColumnType.Column, 'Tier Level')
    riskLevelColumn = new Element.Column(Element.ColumnType.Column, 'Risk Level')
    exemptionLevelColumn = new Element.Column(Element.ColumnType.Column, 'Exemption Level')
    psrRiskLevelColumn = new Element.Column(Element.ColumnType.Column, 'PSR Risk Level')
    psrTierLevelColumn = new Element.Column(Element.ColumnType.Column, 'PSR Tier Level')
    transferRequestLevelColumn = new Element.Column(Element.ColumnType.Column, 'Transfer Request Level')
}
