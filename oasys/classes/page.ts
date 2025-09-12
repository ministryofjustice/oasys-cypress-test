import * as oasys from 'oasys'

/**
 * The Page class is used to define OASys pages, including all the elements on the page (i.e. text boxes, buttons etc), and the menu options used
 * to access it (either main menu or floating menu).  Individual pages are in the `oasys\pages` folder, grouped by functional area into subfolders.
 * Any new pages must be added to the relevant `index.ts` file, they can then be referenced in a test as e.g. `pages.Assessment.Section2`.
 * @module
 */

export abstract class Page {

    name: string
    title: string
    menu: Menu

    /**
     * Sets the value of a multiple element on the pages, each identified by the element name
     * If you provide a PageData type (e.g. setValues<LoginData>(...)), Typescript provides a dropdown for the elements available.
     * 
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    setValues(elementValues: PageData, suppressLog: boolean = false): typeof this {

        Object.keys(elementValues).forEach(elementName => {

            const element = this[elementName]
            if (element == null) {
                throw new Error(`Invalid element name on ${this.name} - ${elementName}`)
            }
            element.setValue(elementValues[elementName])
        })

        if (!suppressLog) cy.log(`Set values on ${this.name} page: ${JSON.stringify(elementValues)} `)
        return this
    }

    /**
     * Checks the value of a multiple element on the pages, each identified by the element name (not case sensitive)
     * The test will fail if any of the values don't match.
     *      
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    checkValues(elementValues: PageData, suppressLog: Boolean = false): typeof this {

        Object.keys(elementValues).forEach(elementName => {

            const element = this[elementName]
            if (element == null) {
                throw new Error(`Invalid element name on ${this.name} - ${elementName}`)
            }
            element.checkValue(elementValues[elementName].toString())
        })

        if (!suppressLog) cy.log(`Checked values on ${this.name} page: ${JSON.stringify(elementValues)} `)
        return this
    }

    /**
     * Writes the value and status of all input and text elements on the page to the log.
     * 
     * Returns the page object so you can chain other commands.
     */
    logValuesAndStatuses(ignoreHidden: boolean = false): typeof this {

        cy.groupedLogStart(`Element values and statuses ${ignoreHidden ? '(visible only) ' : ''}on page: ${this.name} `)
        Object.keys(this).forEach((e) => {

            let element = this[e]
            if (element != null && typeof element.getStatusAndValue === 'function') {  // Check if it's a property that can return a status and value
                element.getStatusAndValue('alias')
                cy.get<ElementStatusAndValue>('@alias').then((result) => {
                    if (!ignoreHidden || result.status != 'notVisible') {
                        cy.groupedLog(`${e}: '${result.value}' (${result.status})`)
                    }
                })
            }
        })
        cy.groupedLogEnd()
        return this
    }

    /**
     * Navigates to the page according to the defined menu details (either OASys main menu or floating navigator)
     * assuming the relevant menu is available.
     * 
     * The Subform option does nothing but is included so that they can be chained with other commands
     * Waits for a page update to complete.
     *
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    goto(suppressLog: Boolean = false): typeof this {

        if (this.menu == null) {
            throw new Error(`Invalid goto for page ${this.name}`)
        }
        else {

            switch (this.menu.type) {
                case 'Floating':
                    oasys.Nav.waitForPageUpdate()

                    cy.get('#leftmenuul').within(() => {

                        if (this.menu.level2 === undefined) {
                            // first level only, just click
                            cy.get('li').contains('a', this.menu.level1).click()
                        }
                        else {
                            // two levels: check if second level is showing already, if not then click on the first
                            cy.get('li').contains('a', this.menu.level1).as('menu1').siblings('ul').within(() => {

                                cy.get('li').contains('a', this.menu.level2).then(($link) => {
                                    if ($link.is(':hidden')) {
                                        cy.get('@menu1').click()
                                    }
                                })
                                cy.get('li').contains('a', this.menu.level2).click()
                            })
                        }
                    })
                    break

                case 'Main':
                    cy.get('#oasysmainmenu').within(() => {
                        cy.contains(this.menu.level1).click()
                        if (this.menu.level2 !== undefined) {
                            if (this.menu.level2[0] == '#') {
                                cy.get(this.menu.level2).click()
                            } else {
                                cy.contains(this.menu.level2).click()
                            }
                        }
                    })
                    break

                case 'Subform':
                    if (this.menu.level1 != '') {
                        if (this.menu.level1.startsWith('#') || this.menu.level1.includes('[')) {
                            cy.get(this.menu.level1).eq(0).click()
                        } else {
                            oasys.Nav.clickButton(this.menu.level1, true)
                        }
                    }
                    break

                default:
                    throw new Error(`Invalid menu type for page ${this.name}`)
            }
        }

        oasys.Nav.waitForPageUpdate()
        if (!suppressLog) cy.log(`Go to page: ${this.name} `)
        return this
    }

    /**
     * Check that this page is currently displayed on screen, using the title defined in the page object.
     * 
     * Returns the page object so you can chain other commands.
     */
    checkCurrent(suppressLog: Boolean = false): typeof this {
        cy.title().should('contain', this.title)
        if (!suppressLog) cy.log(`Check current page: ${this.name} `)
        return this
    }

    /**
     * Check that this page is available on the menu.
     * 
     * Returns the page object so you can chain other commands.
     */
    checkIsOnMenu(): typeof this {

        if (this.menu == null) {
            throw new Error(`Invalid menu check for page ${this.name}`)
        }
        else {

            cy.log(`Checking page is on menu: ${this.name} `)
            switch (this.menu.type) {
                case 'Floating':
                    cy.get('#leftmenuul').within(() => {

                        if (this.menu.level2 === undefined) {
                            // first level only
                            cy.get('li').contains('a', this.menu.level1).should('be.visible')
                        }
                        else {
                            // two levels: check if second level is showing already, if not then click on the first
                            cy.get('li').contains('a', this.menu.level1).as('menu1').siblings('ul').within(() => {

                                cy.get('li').contains('a', this.menu.level2).then(($link) => {
                                    if ($link.is(':hidden')) {
                                        cy.get('@menu1').click()
                                    }
                                })
                                cy.get('li').contains('a', this.menu.level2).should('be.visible')
                            })
                        }
                    })
                    break

                case 'Main':
                    cy.get('#oasysmainmenu').within(() => {
                        cy.contains(this.menu.level1).should('be.visible')
                        if (this.menu.level2 !== undefined) {
                            cy.contains(this.menu.level1).click()
                            cy.contains(this.menu.level2).should('be.visible')
                        }
                    })
                    break

                default:
                    throw new Error(`Invalid menu type for page ${this.name}`)
            }
        }

        return this
    }

    /**
     * Check that this page is not available on the menu.
     */
    checkIsNotOnMenu(): typeof this {

        if (this.menu == null) {
            throw new Error(`Invalid menu check for page ${this.name}`)
        }
        else {

            cy.log(`Checking page is NOT on menu: ${this.name} `)
            switch (this.menu.type) {
                case 'Floating':
                    cy.get('#leftmenuul').within(() => {

                        if (this.menu.level2 === undefined) {
                            // first level only
                            cy.get('li').contains('a', this.menu.level1).should('not.exist')
                        }
                        else {
                            // two levels
                            cy.get('li').contains('a', this.menu.level2).should('not.exist')
                        }
                    })
                    break

                case 'Main':
                    cy.get('#oasysmainmenu').within(() => {
                        if (this.menu.level2 === undefined) {
                            cy.contains(this.menu.level1).should('not.exist')
                        }
                        else {
                            cy.contains(this.menu.level2).should('not.exist')
                        }
                    })
                    break

                default:
                    throw new Error(`Invalid menu type for page ${this.name}`)
            }
        }
        return this

    }

    /**
     * Get the completion status of a section on the floating menu, using a result alias.
     */
    getStatus(resultAlias: string) {

        let result = false
        if (this.menu?.type != 'Floating') {
            throw new Error(`Invalid menu check for page ${this.name}`)
        }
        if (this.menu.level2 === undefined) {
            cy.get(`#leftmenuul li:contains("${this.menu.level1}") img`).invoke('attr', 'title').then((imageTitle) => {
                if (imageTitle == 'Section Complete') {
                    result = true
                }
            }).then(() => {
                cy.wrap(result).as(resultAlias)
            })
        } else {
            cy.get(`#leftmenuul li:contains("${this.menu.level1}") ul li:contains("${this.menu.level2}")`).children().then((menuItem) => {
                result = menuItem.length == 2
            }).then(() => {
                cy.wrap(result).as(resultAlias)
            })
        }
    }

}

// Interface allows Page classes to be passed as parameters
export interface IPage {
    new (): Page;
}