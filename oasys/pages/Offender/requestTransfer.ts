import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RequestTransfer extends Page {

    name = 'RequestTransfer'
    title = 'Request Transfer'

    submit = new Element.Button('Submit')
    cancel = new Element.Button('Cancel')
    offenderSurname = new Element.Textbox('#P10_FAMILY_NAME')
    probationOwner = new Element.Textbox('#P10_OWNING_PROBATION_AREA')
    pnc = new Element.Textbox('#P10_PNC')
    forenames = new Element.Textbox('#P10_FORENAMES')
    prisonOwner = new Element.Textbox('#P10_OWNING_PRISON_AREA')
    probationCrn = new Element.Textbox('#P10_PROBATION_CRN')
    dateOfBirth = new Element.Textbox<OasysDate>('#P10_DATE_OF_BIRTH')
    omFlag = new Element.Textbox('#P10_OFFENDER_MANAGED')
    offenderManagerTeam = new Element.Select('#P10_OFF_MGR_TEAM')
    offenderManager = new Element.Lov('#P10_OFF_MGR_USER_LABEL')
    selectAdditionalTeams = new Element.Shuttle('#shuttleTRF010_ADD_TEAMS')
    requestorComments = new Element.Textbox('#P10_REQUESTOR_COMMENTS')
}
