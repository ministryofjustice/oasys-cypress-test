// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import { testEnvironment, noDatabaseConnection, noOasys } from '../../localSettings'

beforeEach(() => {

    if (noDatabaseConnection) {
        cy.wrap('No database connection').as('appVersion')
        cy.log(`Script: ${Cypress.spec.relative}`)

    } else {
        cy.task('getAppVersion').then((result: DbResponse) => {
            if (result.error != null) {
                throw new Error(result.error)
            }
            const version = result.data as string
            cy.wrap(version).as('appVersion')

            cy.log(`OASys ${version} (${testEnvironment.name}), ${Cypress.browser.name.toUpperCase()} (v${Cypress.browser.majorVersion}). Script: ${Cypress.spec.relative}`)
            cy.task('consoleLog', `OASys version ${version} in ${testEnvironment.name}`)

            cy.visit(testEnvironment.url)
        })
    }
})