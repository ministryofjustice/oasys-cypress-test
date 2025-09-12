﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'

/**
 * This is a base class for assessment pages that contain the standard navigation buttons
 */
export abstract class BaseAssessmentPage extends Page {

    name = 'BaseAssessmentPage'

    save = new Element.Button('Save')
    next = new Element.Button('Next')
    previous = new Element.Button('Previous')
    close = new Element.Button('Close')
    print = new Element.Button('Print')
    markAsComplete = new Element.Button('Mark As Complete')

    /**
     * Navigate to the page, click on Mark as Complete, and then check that the section is marked complete.
     */
    markCompleteAndCheck() {

        this.goto()
        this.markAsComplete.click()
        this.checkCompletionStatus(true)
    }

    /**
     * Checks that a section has the expected completion status on the floating menu.  Parameter is true if expected to be complete.
     */
    checkCompletionStatus(expectedStatus: boolean): typeof this {

        if (this.menu.level2 === undefined) {
            cy.get(`#leftmenuul li:contains("${this.menu.level1}") img`).invoke('attr', 'title').then((imageTitle) => {
                const complete = imageTitle == 'Section Complete'
                if (complete != expectedStatus) {
                    throw new Error(`${this.name} - expected completion status ${expectedStatus}, actual ${complete}.`)
                }
                cy.log(`${this.name} - completion status: ${complete}.`)
            })
        } else {
            cy.get(`#leftmenuul li:contains("${this.menu.level1}") ul li:contains("${this.menu.level2}")`).children().then((menuItem) => {

                let complete = false
                for (let i = 0; i < menuItem.length; i++) {
                    if (menuItem[i].textContent == this.menu.level2) {
                        if (i > 0 && menuItem[i - 1].textContent == '') {
                            complete = true
                            break
                        }
                    }
                }
                if (complete != expectedStatus) {
                    throw new Error(`${this.name} - expected completion status ${expectedStatus}, actual ${complete}.`)
                }
                cy.log(`${this.name} - completion status: ${complete}.`)
            })
        }
        return this
    }

}


