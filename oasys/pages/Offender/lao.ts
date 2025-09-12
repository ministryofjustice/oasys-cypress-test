import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Lao extends Page {

    name = 'Lao'
    title = 'Limited Access Offender'
    menu: Menu = { type: 'Subform', level1: 'LAO' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    setLaoStatus = new Element.Select('#P90_LAO_STATUS')
    providerEstLocation = new Element.Select('#P90_CT_AREA_EST_CODE')
    lau = new Element.Select('#P90_DIVISION_CODE')
    team = new Element.Select('#P90_TEAM_CODE')
    laoReaders = new Element.Shuttle('OFF030_USERS')
}
