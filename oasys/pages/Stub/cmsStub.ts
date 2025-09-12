import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CmsStub extends Page {

    name = 'CmsStub'
    title = 'Training - CMS Stub'
    menu: Menu = { type: 'Main', level1: 'Training', level2: 'CMS Stub' }

    close = new Element.Button('Close')
    surname = new Element.Textbox('#P900_SURNAME')
    pnc = new Element.Textbox('#P900_PNC')
    probationCrn = new Element.Textbox('#P900_CMS_PROB_NUMBER')
    nomisId = new Element.Textbox('#P900_NOMIS_ID')
    createStub = new Element.Button('Create Stub')
    search = new Element.Button('Search')
    reset = new Element.Button('Reset')
    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname')
    forenameColumn = new Element.Column(Element.ColumnType.Column, 'Forename')
    dateOfBirthColumn = new Element.Column(Element.ColumnType.Column, 'Date Of Birth')
    pncColumn = new Element.Column(Element.ColumnType.Column, 'PNC')
    probationCrnColumn = new Element.Column(Element.ColumnType.Column, 'Case Reference Number')
    prisonNumberColumn = new Element.Column(Element.ColumnType.Column, 'Prison Number')
    nomisIdColumn = new Element.Column(Element.ColumnType.Column, 'Nomis Id')
    deleteColumn = new Element.Column(Element.ColumnType.ButtonColumn, '')
}
