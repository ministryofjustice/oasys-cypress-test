import addContext from 'mochawesome/addContext'
import dayjs from 'dayjs'

var screenshotCount = 0
var logGroup = ""

Cypress.on("test:after:run", (test, runnable) => {

    if (test.state === "failed") {

        const screenshot = `screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`
        const timestamp = dayjs().format('HH:mm:ss.SSS')

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

    const timestamp = dayjs().format('HH:mm:ss.SSS')
    cy.once('test:after:run', (test) => addContext({ test }, `${timestamp}:  ${message} ${args}`))

    return null
})

Cypress.Commands.overwrite('screenshot', (originalFn, subject, name, options) => {

    // If name is not defined, generate a unique filename
    var screenshotName = name
    if (!name) {
        screenshotName = `screenshot${screenshotCount++}`
    } else if (name.toUpperCase() == 'TIMESTAMP') {
        screenshotName = dayjs().format('YYYY-MM-DD_HH-mm-ss')
    }

    let timestamp = dayjs().format('HH:mm:ss.SSS')
    cy.once('test:after:run', (test) => addContext({ test }, `${timestamp}: Screenshot '${screenshotName}.png'`))
    cy.once('test:after:run', (test) => addContext({ test }, `screenshots/${Cypress.spec.name}/${screenshotName}.png`))

    return originalFn(subject, screenshotName, options)
})

Cypress.Commands.add('groupedLogStart', (title) => {

    let timestamp = dayjs().format('HH:mm:ss.SSS')
    logGroup = `${timestamp}:  ${title}`
})

Cypress.Commands.add('groupedLog', (text) => {
    logGroup += `\n            :       ${text}`
})

Cypress.Commands.add('groupedLogEnd', () => {

    let end = logGroup.slice(0)  // Need to copy it otherwise content gets overwritten
    cy.once('test:after:run', (test) => addContext({ test }, `${end}`))
})