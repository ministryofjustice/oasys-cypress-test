import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class TaskManager extends Page {

    name = 'TaskManager'
    title = 'Task Manager'
    menu: Menu = { type: 'Main', level1: 'Tasks' }

    localAdministrationUnit = new Element.Select('#P1_DIVISION_CODE')
    team = new Element.Select('#P1_TEAM_UK')
    userName = new Element.Lov('#P1_OASYS_USER_CODE_LABEL')
    taskName = new Element.Select('#P1_TASK_TYPE_ELM')
    offenderName = new Element.Lov('#P1_OFFENDER_PK_LABEL')
    showCompleted = new Element.Select('#P1_SHOW_COMPLETED')
    resultsPerPage = new Element.Select('#P1_RESULTS_PER_PAGE')
    search = new Element.Button('Search')
    taskList = new TaskList('R6622119977925483', 'Task List')
}

export class TaskList extends Element.Table {

    statusColumn = new Element.Column(Element.ColumnType.ImageColumn, `#ICONS_${this.id}`, this.id)
    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname', this.id)
    forenameColumn = new Element.Column(Element.ColumnType.Column, 'Forename', this.id)
    pNCColumn = new Element.Column(Element.ColumnType.Column, 'PNC', this.id)
    usernameColumn = new Element.Column(Element.ColumnType.Column, 'Username', this.id)
    taskNameColumn = new Element.Column(Element.ColumnType.Column, 'Task Name', this.id)
    teamColumn = new Element.Column(Element.ColumnType.Column, 'Team', this.id)
    dateDueColumn = new Element.Column(Element.ColumnType.Column, 'Date Due', this.id)
    completedColumn = new Element.Column(Element.ColumnType.Column, 'Completed?', this.id)
}