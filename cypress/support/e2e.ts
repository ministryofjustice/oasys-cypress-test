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

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import isLeapYear from 'dayjs/plugin/isLeapYear'

Cypress.dayjs = dayjs
Cypress.dayjs.extend(customParseFormat)
Cypress.dayjs.extend(utc)
Cypress.dayjs.extend(isLeapYear)

beforeEach(() => {

    if (noDatabaseConnection) {
        cy.wrap('No database connection').as('appVersion')
        cy.log(`Script: ${Cypress.spec.relative}`)

    } else {
        cy.task('getAppInfo').then((result: DbResponse) => {
            if (result.error != null) {
                throw new Error(result.error)
            }
            const appData = result.data as string[]

            cy.wrap(appData[0]).as('appVersion')
            cy.wrap(appData[1]).as('probForceCrn')

            cy.log(`OASys ${appData[0]} (${testEnvironment.name}), ${Cypress.browser.name.toUpperCase()} (v${Cypress.browser.majorVersion}). Script: ${Cypress.spec.relative}`)
            cy.task('consoleLog', `OASys version ${appData[0]} in ${testEnvironment.name}`)

            if (!noOasys) {
                cy.visit(testEnvironment.url)
            }
        })
    }
})