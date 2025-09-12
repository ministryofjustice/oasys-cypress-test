﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'

export class RoshScreeningSection1 extends BaseAssessmentPage {

    name = 'RoshScreeningSection1'
    title = 'Risk of Serious Harm Screening'
    menu: Menu = { type: 'Floating', level1: 'RoSH Screening', level2: 'Section 1' }

    createSARA = new Element.Button('Create SARA')
    cancelSARA = new Element.Button('Cancel')
    goToSARA = new Element.Button('Go to SARA')
    areasOfConcern = new AreasOfConcern()
    mark1_2AsNo = new Element.Button('input[onclick*="P2_BT_NO"]')
    r1_2_1C = new Element.Select('#itm_R1_2_1_1_V2')        // Murder / attempted murder / threat or conspiracy to murder / manslaughter
    r1_2_1P = new Element.Select('#itm_R1_2_1_2_V2')
    r1_2_2C = new Element.Select('#itm_R1_2_2_1_V2')        // Wounding / GBH(Sections 18 / 20 Offences Against the Person Act 1861)
    r1_2_2P = new Element.Select('#itm_R1_2_2_2_V2')
    r1_2_3C = new Element.Select('#itm_R1_2_3_1_V2')        // Any sexual offence against a child(ren)
    r1_2_3P = new Element.Select('#itm_R1_2_3_2_V2')
    r1_2_4C = new Element.Select('#itm_R1_2_4_1_V2')        // Rape or serious sexual offence against an adult
    r1_2_4P = new Element.Select('#itm_R1_2_4_2_V2')
    r1_2_5C = new Element.Select('#itm_R1_2_5_1_V2')        // Any other offence against a child(see revised Appendix 1)
    r1_2_5P = new Element.Select('#itm_R1_2_5_2_V2')
    r1_2_6C = new Element.Select('#itm_R1_2_6_1_V2')        // Aggravated burglary
    r1_2_6P = new Element.Select('#itm_R1_2_6_2_V2')
    r1_2_7C = new Element.Select('#itm_R1_2_7_1_V2')        // Arson
    r1_2_7P = new Element.Select('#itm_R1_2_7_2_V2')
    r1_2_8C = new Element.Select('#itm_R1_2_8_1_V2')        // Criminal damage with the intent to endanger life
    r1_2_8P = new Element.Select('#itm_R1_2_8_2_V2')
    r1_2_9C = new Element.Select('#itm_R1_2_9_1_V2')        // Kidnapping / false imprisonment
    r1_2_9P = new Element.Select('#itm_R1_2_9_2_V2')
    r1_2_10C = new Element.Select('#itm_R1_2_10_1_V2')      // Possession of a firearm with intent to endanger life or resist arrest
    r1_2_10P = new Element.Select('#itm_R1_2_10_2_V2')
    r1_2_11C = new Element.Select('#itm_R1_2_11_1_V2')      // Racially motivated / racially aggravated offence
    r1_2_11P = new Element.Select('#itm_R1_2_11_2_V2')
    r1_2_12C = new Element.Select('#itm_R1_2_12_1_V2')      // Robbery
    r1_2_12P = new Element.Select('#itm_R1_2_12_2_V2')
    r1_2_13C = new Element.Select('#itm_R1_2_13_1_V2')      // Any offence involving possession and / or use of weapons
    r1_2_13P = new Element.Select('#itm_R1_2_13_2_V2')
    r1_2_14C = new Element.Select('#itm_R1_2_14_1_V2')      // Any other offence which is as serious, eg blackmail, harassment, stalking, indecent images of children, child neglect, abduction etc.
    r1_2_14P = new Element.Select('#itm_R1_2_14_2_V2')
    otherOffence = new Element.Textbox('#textarea_R1_2_14_t_V2')    // Indicate offence    
    r1_2_16C = new Element.Select('#itm_R1_2_16_1_V2')      // Any offence commited in a custodial setting
    r1_2_16P = new Element.Select('#itm_R1_2_16_2_V2')
    mark1_3AsNo = new Element.Button('input[onclick*="P3_BT_NO"]')
    r1_3_1 = new Element.Select('#itm_R1_3_1_2_V2')         // Assaulted / threatened staff
    r1_3_2 = new Element.Select('#itm_R1_3_2_2_V2')         // Assaulted / threatened others
    r1_3_20 = new Element.Select('#itm_R1_3_20_2_V2')       // Domestic abuse towards a partner or other member of their family
    r1_3_4 = new Element.Select('#itm_R1_3_4_2_V2')         // Committed a serious offence whilst not complying with medication
    r1_3_6 = new Element.Select('#itm_R1_3_6_2_V2')         // Been involved in any hate-based behaviour
    r1_3_7 = new Element.Select('#itm_R1_3_7_2_V2')         // Been assessed as high risk of serious harm on a Previous occasion
    r1_3_10 = new Element.Select('#itm_R1_3_10_2_V2')       // Been a conditionally discharged patient subject to a restriction order under Section 41 MHA 1983
    r1_3_12 = new Element.Select('#itm_R1_3_12_2_V2')       // Been a stalker
    r1_3_13 = new Element.Select('#itm_R1_3_13_2_V2')       // Displayed obsessive behaviour linked to offending
    r1_3_14 = new Element.Select('#itm_R1_3_14_2_V2')       // Been involved in bizarre or ritualistic aspects linked to offending
    r1_3_15 = new Element.Select('#itm_R1_3_15_2_V2')       // Displayed any offence-related behaviour observed in a custodial setting
    r1_3_16 = new Element.Select('#itm_R1_3_16_2_V2')       // Displayed any inappropriate behaviour towards members of staff, visitors or prisoners
    r1_3_17 = new Element.Select('#itm_R1_3_17_2_V2')       // Established links or associations, whilst in custody, which increase risk of serious harm
    r1_3_18 = new Element.Select('#itm_R1_3_18_2_V2')       // Committed an offence involving excessive use of violence or sadistic violence
    r1_3_21 = new Element.Select('#itm_R1_3_21_2_V2')       // Have they ever perpetrated behaviours relating to group-based child sexual exploitation
    r1_4 = new Element.Select('#itm_R1_4')
    r1_4_1 = new Element.Select('#itm_R1_4_1')      //Banning order
    r1_4_19 = new Element.Select('#itm_R1_4_19')    //Child arrangement order
    r1_4_2 = new Element.Select('#itm_R1_4_2')      //Civil injunction
    r1_4_3 = new Element.Select('#itm_R1_4_3')      //Community protection notice
    r1_4_4 = new Element.Select('#itm_R1_4_4')      //Criminal behaviour order
    r1_4_7 = new Element.Select('#itm_R1_4_7')      //Female genital mutilation order
    r1_4_8 = new Element.Select('#itm_R1_4_8')      //Forced marriage order
    r1_4_20 = new Element.Select('#itm_R1_4_20')    //Knife crime prevention order
    r1_4_9 = new Element.Select('#itm_R1_4_9')      //Non-molestation order
    r1_4_21 = new Element.Select('#itm_R1_4_21')    //Occupation order
    r1_4_22 = new Element.Select('#itm_R1_4_22')    //Prohibited steps order
    r1_4_10 = new Element.Select('#itm_R1_4_10')    //Public spaces protection order
    r1_4_11 = new Element.Select('#itm_R1_4_11')    //Restraining orders
    r1_4_12 = new Element.Select('#itm_R1_4_12')    //Serious crime prevention order
    r1_4_13 = new Element.Select('#itm_R1_4_13')    //Serious violence reduction order
    r1_4_14 = new Element.Select('#itm_R1_4_14')    //Sexual harm prevention orders
    r1_4_15 = new Element.Select('#itm_R1_4_15')    //Sexual risk order
    r1_4_16 = new Element.Select('#itm_R1_4_16')    //Slavery and trafficking prevention and risk orders
    r1_4_17 = new Element.Select('#itm_R1_4_17')    //Stalking protection order
    r1_4_18 = new Element.Select('#itm_R1_4_18')    //Violent offender order
    save = new Element.Button('#P2_BT_SAVE_BOTT')
}

class AreasOfConcern {

    selector = 'table[summary="Areas with cause for concern in the context of harm"]'

    /**
     * Gets areas of concern listed on the page as a string array and returns them using the specified alias.
     */
    getValues(resultAlias: string) {

        const result: string[] = []
        cy.get(this.selector).then((container) => {
            const rows = container.find('tr')
            if (rows.length > 1) {
                for (let r = 1; r < rows.length; r++) {  // first row is heading, ignore it
                    result.push(rows[r].textContent)
                }
            }
            cy.wrap(result).as(resultAlias)
        })
    }
    /**
     * Checks the areas of concern for a specific item
     */
    checkValuesInclude(value: string) {

        cy.log(`Checking that areas of concern includes ${value}`)
        const result: string[] = []
        cy.get(this.selector).then((container) => {
            const rows = container.find('tr')
            if (rows.length > 1) {
                for (let r = 1; r < rows.length; r++) {  // first row is heading, ignore it
                    result.push(rows[r].textContent)
                }
            }
            expect(result.includes(value)).eq(true)
        })
    }
}