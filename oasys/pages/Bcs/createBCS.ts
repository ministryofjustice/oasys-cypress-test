import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CreateBCS extends Page {

    name = 'CreateBCS'
    title = 'Create Basic Custody Screening'

    purposeOfAssessment = new Element.Select('#P10_BCS_PURPOSE_ASSESSMENT_ELM')
    selectTeam = new Element.Select('#P10_TEAM_UK')
    selectBcsScreener = new Element.Lov('#P10_ASSESSOR_USER_CODE_LABEL')
    create = new Element.Button('Create')
    cancel = new Element.Button('Cancel')
}
