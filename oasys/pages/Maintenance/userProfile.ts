import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class UserProfile extends Page {

    name = 'UserProfile'
    title = 'User Search'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: '#main_menu_right_maintenance_user_profile' }

    close = new Element.Button('Close')
    providerEstablishment = new Element.Select('#P7_AREA_ESTABLISHMENT')
    team = new Element.Select('#P7_TEAM')
    userName = new Element.Textbox('#P7_USER_NAME')
    surname = new Element.Textbox('#P7_FAMILY_NAME')
    forename1 = new Element.Textbox('#P7_FORENAME_1')
    resultsPerPage = new Element.Select('#P7_RESULTS_PER_PAGE')
    search = new Element.Button('Search')
    reset = new Element.Button('Reset')
    userNameColumn = new Element.Column(Element.ColumnType.Column, 'User Name')
    surnameColumn = new Element.Column(Element.ColumnType.Column, 'Surname')
    forename1Column = new Element.Column(Element.ColumnType.Column, 'Forename 1')
    forename2Column = new Element.Column(Element.ColumnType.Column, 'Forename 2')
    existingProfile = new Element.Column(Element.ColumnType.Column, 'Existing Profile')
    profileStatusColumn = new Element.Column(Element.ColumnType.Column, 'User Status')
}
