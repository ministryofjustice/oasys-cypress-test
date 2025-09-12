import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class RolesAndFunctions extends Page {

    name = 'RolesAndFunctions'
    title = 'Maintain Roles and Functions'
    menu: Menu = { type: 'Main', level1: 'Maintenance', level2: 'Roles and Functions' }

    role = new Element.Select('#P7_REF_ROLE_CODE')
    createNewRole = new Element.Button('Create New Role')
    search = new Element.Button('Search')
    restrictedRole = new Element.Radiogroup('#P7_RESTRICTED_IND')
    functionType = new Element.Select('#P7_FUNCTION_TYPE')
    functionsShuttle = new Element.Shuttle('#shuttleREF050_FUNCTIONS')
    providerTypesShuttle = new Element.Shuttle('#shuttleREF050_PROVIDER_TYPES')
    close = new Element.Button('Close')
    save = new Element.Button('Save')
}
