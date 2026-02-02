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
import { AppVersionHistory } from 'lib/dateTime'

beforeEach(() => {

    if (noDatabaseConnection) {
        cy.wrap('No database connection').as('appVersion')
        cy.log(`Script: ${Cypress.spec.relative}`)

    } else {
        cy.task('getAppVersionHistory').then((appVersionHistory: AppVersionHistory) => {

            cy.task('getAppConfig').then((appConfig: AppConfig) => {

                const appVersion = appVersionHistory.currentVersion
                cy.wrap(appVersion).as('appVersion')
                cy.wrap(appVersionHistory).as('appVersionHistory')
                cy.wrap(appConfig).as('appConfig')

                cy.log(`OASys ${appVersion} (${testEnvironment.name}), ${Cypress.browser.name.toUpperCase()} (v${Cypress.browser.majorVersion}). Script: ${Cypress.spec.relative}`)
                cy.task('consoleLog', `OASys version ${appVersion} in ${testEnvironment.name}`)

                if (!noOasys) {
                    cy.visit(testEnvironment.url)
                }
            })
        })
    }
})