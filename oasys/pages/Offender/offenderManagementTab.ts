import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OffenderManagementTab extends Page {

    name = 'OffenderManagementTab'

    reviewDueDate = new Element.Textbox<OasysDate>('#P10_REVIEW_DATE')
    reviewReminderDate = new Element.Textbox<OasysDate>('#P10_REVIEW_REMINDER_DATE')
    remandIndicator = new Element.Checkbox('#P10_REMAND_IND_0')
    controllingOwnerPrison = new Element.Textbox('#P10_CONT_OWNER_PRIS')
    prisonEstablishment = new Element.Textbox('#P10_PRISON_EST')
    prisonLau = new Element.Lov('#P10_PRIS_LDU_LABEL')
    offenderSupervisorTeam = new Element.Lov('#P10_OFF_SUP_TEAM_LABEL')
    offenderSupervisor = new Element.Lov('#P10_OFF_SUP_LABEL')
    offenderSupervisorPosition = new Element.Textbox('#P10_OFF_SUP_POS')
    prisonTelephone = new Element.Textbox('#P10_PRISON_TEL_NO')
    prisonEmail = new Element.Textbox('#P10_PRISON_EMAIL')
    prisonAdditionalTeams = new Element.Textbox('#P10_PRISON_ADD_TEAMS')
    hostCrc = new Element.Textbox('#P10_HOST_CRC')
    resettlementOfficer = new Element.Textbox('#P10_RESETTLEMENT_OFFICER')
    awaitingPrisonOwner = new Element.Textbox('#P10_AWAITING_PRISON_OWNER')
    omFlag = new Element.Checkbox('#P10_OFFENDER_MANAGED_IND_0')
    controllingOwnerProbation = new Element.Textbox('#P10_CONT_OWNER_PROB')
    probationProvider = new Element.Textbox('#P10_PROB_AREA')
    probationLau = new Element.Lov('#P10_PROB_LDU_LABEL')
    offenderManagerTeam = new Element.Lov('#P10_OFF_MAN_TEAM_LABEL')
    offenderManager = new Element.Lov('#P10_OFF_MANAGER_LABEL')
    offenderManagerPosition = new Element.Textbox('#P10_OFF_MAN_POS')
    probationTelephone = new Element.Textbox('#P10_PROB_TEL_NO')
    probationEmail = new Element.Textbox('#P10_PROB_EMAIL')
    additionalTeams = new Element.Textbox('#P10_PROB_ADD_TEAMS')
    addEditViewTeams = new Element.Button('#P10_ADD_PROBATION_TEAM')
    awaitingProbationOwner = new Element.Textbox('#P10_AWAITING_PROB_OWNER')
    awaitingProbationTeam = new Element.Textbox('#P10_AWAITING_PROB_TEAM')
    awaitingProbationOffenderManager = new Element.Textbox('#P10_AWAITING_PROB_MAN')
    additionalProvider = new Element.Textbox('#P10_PSR_AREA')
    additionalProviderTelephone = new Element.Textbox('#P10_PSR_TEL')
    additionalProviderTeam = new Element.Select('#P10_PSR_TEAM')
    additionalProviderEmail = new Element.Textbox('#P10_PSR_EMAIL')
    addtionalProviderAssessor = new Element.Lov('#P10_PSR_ASSESSOR_LABEL')
    retainOffenderRecords = new Element.Checkbox('#P10_RETAINED_IND_0')
    reasonForRetentionOfOffenderData = new Element.Textbox('#P10_RETAINED_REASON')
}
