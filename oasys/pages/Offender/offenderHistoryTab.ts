import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OffenderHistoryTab extends Page {

    name = 'OffenderHistoryTab'

    startDateColumn = new Element.Column(Element.ColumnType.Column, 'Start Date')
    prisonEstablishmentColumn = new Element.Column(Element.ColumnType.Column, 'Prison Establishment')
    offenderSupervisorColumn = new Element.Column(Element.ColumnType.Column, 'Offender Supervisor')
    probationProviderColumn = new Element.Column(Element.ColumnType.Column, 'Probation Provider')
    probationTeamColumn = new Element.Column(Element.ColumnType.Column, 'Probation Team')
    offenderManagerColumn = new Element.Column(Element.ColumnType.Column, 'Offender Manager')
    controllingOwnerColumn = new Element.Column(Element.ColumnType.Column, 'Controlling Owner')
    physicalLocationColumn = new Element.Column(Element.ColumnType.Column, 'Physical Location')
    dateColumn = new Element.Column(Element.ColumnType.Column, 'Date of Merge')
    previousProbationOwnerColumn = new Element.Column(Element.ColumnType.Column, 'Previous Owning Probation Provider')
    previousPrisonOwnerColumn = new Element.Column(Element.ColumnType.Column, 'Previous Owning Prison Establishment')
    eventNameColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Events Event Name')
    eventColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Events Date / Time')
    eventUsernameColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Events Username')
    eventLaoStatusColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Events LAO Status')
    eventDetailsColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Events Details')
    eventIpAddressColumn = new Element.Column(Element.ColumnType.Column, 'Auditable Events User IP Address')
}
