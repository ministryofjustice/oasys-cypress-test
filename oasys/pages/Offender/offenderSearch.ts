import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class OffenderSearch extends Page {

    name = 'OffenderSearch'
    title = 'Offender Search'
    menu: Menu = { type: 'Main', level1: 'Search' }

    close = new Element.Button('Close')
    surname = new Element.Textbox('#P900_SURNAME')
    forename = new Element.Textbox('#P900_FORENAME')
    surnameSoundsLike = new Element.Select('#P900_SOUNDSLIKE')
    dateOfBirth = new Element.Textbox<OasysDate>('#P900_DOB')
    pnc = new Element.Textbox('#P900_PNC')
    provider = new Element.Select('#P900_CT_AREA_EST')
    cro = new Element.Textbox('#P900_CRO')
    probationCrn = new Element.Textbox('#P900_CMS_PROB_NUMBER')
    prisonNomisNumber = new Element.Textbox('#P900_CMS_PRIS_NUMBER')
    prisonLidsNumber = new Element.Textbox('#P900_PRISON_NUMBER')
    searchCms = new Element.Select('#P900_SEARCH_CMS')
    resultsPerPage = new Element.Select('#P900_RESULTS_PER_PAGE')
    search = new Element.Button('Search')
    reset = new Element.Button('Reset')
    createOffender = new Element.Button('Create Offender')
    statusColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Â ')
    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname')
    forenameColumn = new Element.Column(Element.ColumnType.Column, 'Forename')
    dateOfBirthColumn = new Element.Column(Element.ColumnType.Column, 'Date Of Birth')
    pncColumn = new Element.Column(Element.ColumnType.Column, 'PNC')
    probCaseRefColumn = new Element.Column(Element.ColumnType.Column, 'Prob Case Ref')
    probationCrnColumn = new Element.Column(Element.ColumnType.Column, 'Case Reference Number')
    prisonNomisNumberColumn = new Element.Column(Element.ColumnType.Column, 'Prison NOMIS Number')
    controllingOwnerColumn = new Element.Column(Element.ColumnType.Column, 'Controlling Owner')
}
