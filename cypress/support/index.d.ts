declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Start a grouped log which will write multiple items as a single log entry
     * Use groupedLog(text) to write, and groupedLogEnd() to finish.
     */
    groupedLogStart(title: string): Chainable<any>

    /**
     * Write to a grouped log entry.
     * Use groupedLogStart(title) to start, and groupedLogEnd() to finish.
     */
    groupedLog(text: string): Chainable<any>

    /**
     * Ends a grouped log and writes it to the report.
     */
    groupedLogEnd(): Chainable<any>
  }
  interface Cypress {
    dayjs: any
  }
}