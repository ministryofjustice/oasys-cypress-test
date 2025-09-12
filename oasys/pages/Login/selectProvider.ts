import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class SelectProvider extends Page {

    name = 'SelectProvider'
    title = 'Set Provider/Establishment'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Switch Profile' }

    chooseProviderEstablishment = new Element.Select('#P10_CT_AREA_EST')
    setProviderEstablishment = new Element.Button('#P10_CONTINUE_BT')
    cancel = new Element.Button('#P10_BT_CANCEL')
}
