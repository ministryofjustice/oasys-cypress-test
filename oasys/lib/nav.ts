/**
 * __oasys.Nav.*function*__  
 * 
 * Top-level library functions such as login and history.
 * 
 * See also the [`Page`](../../Classes/classes/page.Page.html) class which has a `goto()` method to navigate through the OASys menus 
 * as well as other methods to interact with pre-defined elements on OASys pages.  
 * @module Navigation
 */

import { Page } from 'classes/page'


/**
 * Goto any of the predefined OASys pages, assuming the relevant menu option is available on screen.
 * 
 * Returns a page object that can be used to populate items on the page.
 */
export function goto<Type extends Page>(p: { new(): Type }): Type {
    return new p().goto();
}

/**
 * Generic button click for standard OASys buttons, parameter is the button label as seen on screen.
 * 
 * Writes to the log unless suppressLog (optional) is true
 */
export function clickButton(label: string, suppressLog: Boolean = false): void {

    cy.get(`input[type='button'][value='${label}']`).eq(0).click()
    waitForPageUpdate()
    if (!suppressLog) cy.log(`Click button: ${label}`)
}

/**
 * Selects an item on the history menu.
 * 
 * If no parameters are provided, selects the first item on the menu, otherwise:
 * 
 * - history(surname, forename) - to select an offender by name
 * - history(surname, forename, assessment) - to select an assessment
 * 
 * or replace surname, forename with an Offender object, e.g.
 * 
 * - history(offender1)
 * - history(offender1, 'Start of Community Order')
 * 
 * (NOTE this will not work if the offender object contains auto-generated values)
 * 
 * or use a Cypress alias to an offender object (as populated by the offender.create functions), e.g.
 * 
 * - history('@offender1')
 * - history('@offender1', 'Start of Community Order')
 * 
 */
export function history(): null
export function history(alias: string, assessment?: PurposeOfAssessment): null
export function history(surname: string, forename: string, assessment?: PurposeOfAssessment): null
export function history(offender: OffenderDef, assessment?: PurposeOfAssessment): null
export function history(p1?: OffenderDef | string, p2?: string, p3?: string) {

    if (p1 === undefined) {
        cy.get('#oasysmainmenu').contains('li', 'History').click().get('#history_1').click()
        cy.log(`History menu: first item`)
    }
    else {

        var surname: string
        var forename: string
        var assessment: string

        if ((p1 as OffenderDef).surname === undefined) {
            // Not an Offender object, so treat parameters as strings

            if ((p1 as string).charAt(0) == '@') {  // offender alias
                let alias = p1 as string
                cy.get<OffenderDef>(alias).then((offender) => {
                    history(offender.surname, offender.forename1, p2 as PurposeOfAssessment)
                })
                return
            }
            surname = p1 as string
            forename = p2
            assessment = p3
        }
        else {
            const offender = (p1 as OffenderDef)
            surname = offender.surname
            forename = offender.forename1
            assessment = p2
        }

        if (surname === undefined || forename === undefined) {
            throw new Error(`Missing surname or forename in history data: ${surname}, ${forename}`)
        }
        if (assessment === undefined) {
            cy.get('#oasysmainmenu').contains('li', 'History').click().contains(`Offender - ${forename} ${surname}`).click()
            cy.log(`History menu: Offender - ${forename} ${surname}`)
        }
        else {
            cy.get('#oasysmainmenu').contains('li', 'History').click().contains(`${assessment} - ${forename} ${surname}`).click()
            cy.log(`History menu: ${assessment} - ${forename} ${surname}`)
        }
    }

    waitForPageUpdate()
}


/**
 * Waits a short time for the Please Wait or 'updating' element to appear, then (if shown) waits (using the standard Cypress timeout) for it to disappear again.
 */
export function waitForPageUpdate() {

    let updatingElement = '*[class~="blockUI"],*[class~="u-Processing"]'

    cy.wait(500)
    if (Cypress.$(updatingElement).length > 0) {
        cy.get(updatingElement).should('not.exist')  // If shown, wait for it to go
    }
}

/**
 * Clicks the button that should trigger an alert, optionally checks the alert text then and accepts the alert.
 */
export function handleAlert(buttonToClick: string, exptectedText: string = null) {

    // Set up a Cypress event to trap the alert
    cy.on('window:confirm', (str) => {
        if (exptectedText != null) {
            expect(str).to.equal(exptectedText)
        }
    })
    clickButton(buttonToClick)
}

