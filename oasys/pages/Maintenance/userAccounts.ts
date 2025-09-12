import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class UserAccounts extends Page {

    name = 'UserAccounts'
    title = 'User Search'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'User Accounts' }

    close = new Element.Button('Close')
    userSearch = new Element.Link('User Search')
    userName = new Element.Textbox('#P7_USER_NAME')
    surname = new Element.Textbox('#P7_FAMILY_NAME')
    forename1 = new Element.Textbox('#P7_FORENAME_1')
    resultsPerPage = new Element.Select('#P7_RESULTS_PER_PAGE')
    createAccount = new Element.Button('Create Account')
    search = new Element.Button('Search')
    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname')
    userNameColumn = new Element.Column(Element.ColumnType.Column, 'User Name')
    forename1Column = new Element.Column(Element.ColumnType.Column, 'Forename 1')
    forename2Column = new Element.Column(Element.ColumnType.Column, 'Forename 2')
    userStatusColumn = new Element.Column(Element.ColumnType.Column, 'User Status')
}
