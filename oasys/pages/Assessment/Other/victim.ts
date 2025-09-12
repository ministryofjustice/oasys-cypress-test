import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Victim extends Page {

    name = 'Victim'
    menu: Menu = { type: 'Subform', level1: 'Enter Victim Details' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    approxAge = new Element.Select('#P3_AGE_OF_VICTIM_ELM')
    gender = new Element.Select('#P3_GENDER_ELM')
    raceEthnicity = new Element.Select('#P3_ETHNIC_CATEGORY_ELM')
    relationship = new Element.Select('#P3_VICTIM_RELATION_ELM')
    delete = new Element.Button('Delete')
    addAnotherVictim = new Element.Button('Add Another Victim')
}
