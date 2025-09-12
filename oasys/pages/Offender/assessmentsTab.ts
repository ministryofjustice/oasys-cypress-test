import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class AssessmentsTab extends Page {

    name = 'AssessmentsTab'
    assessments = new AssessmentsTable('R5522906992105444', 'Assessments')
}

export class AssessmentsTable extends Element.Table {

    status = new Element.Column(Element.ColumnType.ImageColumn, `#ASSESSMENT_STATUS_ELM_${this.id}`, this.id)
    san = new Element.Column(Element.ColumnType.ImageColumn, `#SAN_${this.id}`, this.id)
    dateCompleted = new Element.Column(Element.ColumnType.Column, `#DATE_COMPLETE_${this.id}`, this.id)
    purposeOfAssessment = new Element.Column(Element.ColumnType.Column, `#PURPOSE_${this.id}`, this.id)
    lockAssessment = new Element.Column(Element.ColumnType.ButtonColumn, `#LOCKING_BUTTON_${this.id}`, this.id)
}