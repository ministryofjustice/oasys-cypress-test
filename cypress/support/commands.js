import addContext from 'mochawesome/addContext'
import { Temporal } from '@js-temporal/polyfill'

var screenshotCount = 0
var logGroup = ""

/**
 * Gets the correct relative path for a screenshot in the report
 */
function getSpecPath() {

    const runCommand = Cypress.env('runCommand').replaceAll(String.fromCharCode(92), '/')
    const location = Cypress.env('location').replaceAll(String.fromCharCode(92), '/')

    // If running a single test, just need the filename part
    if (runCommand.length > 3 && runCommand.substring(runCommand.length - 3) == '.ts') {
        return runCommand.substring(runCommand.lastIndexOf('/') + 1)
    } else {
        // const runCommandRelativePath = runCommand.replace(`${location}/`, '')
        const path = Cypress.spec.relative.replaceAll(String.fromCharCode(92), '/')
        return path.substring(path.lastIndexOf('/') + 1)
    }
}

Cypress.on("test:after:run", (test, runnable) => {

    // Add failure screenshot to the report
    if (test.state === "failed") {

        const screenshot = `screenshots/${getSpecPath()}/${runnable.parent.title} -- ${test.title} (failed).png`
        const timestamp = Temporal.Now.plainTimeISO().toString({ fractionalSecondDigits: 3 })

        cy.once('test:after:run', (test) => addContext({ test }, `${timestamp}:  TEST FAILED`))
        cy.once('test:after:run', (test) => addContext({ test }, test.err.stack.replaceAll('webpack:///./', '')))
        cy.once('test:after:run', (test) => addContext({ test }, screenshot))
    }
})

Cypress.Commands.overwrite('log', (originalFn, message, args) => {

    if (args == undefined) {
        args = ''
    }
    else {
        args = JSON.stringify(args)
    }
    Cypress.log({ displayName: '🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹', message: '' })
    Cypress.log({ displayName: message, message: `${args}` })
    Cypress.log({ displayName: '🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹', message: '' })

    const timestamp = Temporal.Now.plainTimeISO().toString({ fractionalSecondDigits: 3 })
    cy.once('test:after:run', (test) => addContext({ test }, `${timestamp}:  ${message} ${args}`))

    return null
})

/**
 * Modified version of the screenshot command, to provide filenames as:
 *   - sequentially numbered
 *   - specified name
 *   - timestamp (pass 'TIMESTAMP' as the parameter)
 */
Cypress.Commands.overwrite('screenshot', (originalFn, subject, name, options) => {

    // If name is not defined, generate a unique filename
    var screenshotName = name
    if (!name) {
        screenshotName = `screenshot${screenshotCount++}`
    } else if (name.toUpperCase() == 'TIMESTAMP') {
        screenshotName = Temporal.Now.plainTimeISO().toString()
    }

    let timestamp = Temporal.Now.plainTimeISO().toString({ fractionalSecondDigits: 3 })
    cy.once('test:after:run', (test) => addContext({ test }, `${timestamp}: Screenshot '${screenshotName}.png'`))
    cy.once('test:after:run', (test) => addContext({ test }, `screenshots/${getSpecPath()}/${screenshotName}.png`))

    return originalFn(subject, screenshotName, options)
})

Cypress.Commands.add('groupedLogStart', (title) => {

    let timestamp = Temporal.Now.plainTimeISO().toString({ fractionalSecondDigits: 3 })
    logGroup = `${timestamp}:  ${title}`
})

Cypress.Commands.add('groupedLog', (text) => {
    logGroup += `\n            :       ${text}`
})

Cypress.Commands.add('groupedLogEnd', () => {

    let end = logGroup.slice(0)  // Need to copy it otherwise content gets overwritten
    cy.once('test:after:run', (test) => addContext({ test }, `${end}`))
})
