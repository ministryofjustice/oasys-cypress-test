import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class MaintainAuditImportanceLevels extends Page {

    name = 'MaintainAuditImportanceLevels'
    title = 'Maintain Audit Importance Levels'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Maintain Audit Importance Levels' }

    close = new Element.Button('Close')
    save = new Element.Button('Save')
    auditableEventType = new Element.Textbox('#P10_EVENT_TYPE_DESC')
    importanceLevel = new Element.Select('#P10_EVENT_LEVEL')
    auditableEventTypeColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Event Type')
    importanceLevelColumn = new Element.Column(Element.ColumnType.Column, 'Importance Level')
}
