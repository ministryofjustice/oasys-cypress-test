var oracledb = require('oracledb')
var connection

import { testEnvironment, userSuffix } from '../../localSettings'

/** 
 * Connect to the Oracle database using parameters configured in environments.ts and localSettings.ts, returns a null string for success, or an error for failure.
 * 
 * This is used by the other functions in this module, only when required.
 */
async function connect(): Promise<string> {

    let db = testEnvironment.database

    try {
        oracledb.fetchAsString = [oracledb.CLOB]

    }
    catch (e) {
        console.log(`Oracle init error: ${e}`)
    }
    try {
        connection = await oracledb.getConnection({
            user: testEnvironment.database.user,
            password: testEnvironment.database.password,
            connectString: testEnvironment.database.connection
        })
        return null
    }
    catch (e) {
        return `Error connecting to database: ${e}`
    }
}

export async function closeConnection() {

    if (connection != null) {
        connection.close()
    }
    return null
}

/** 
 * Executes an Oracle query to get a single string value, returns a DbResponse type object including the return string and error text or null.
 * 
 * This function is called via cypress.config.ts using `cy.task('selectSingleValue', query)`
 */
export async function selectSingleValue(query: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    try {
        let result = await connection.execute(query)
        return { data: result['rows'][0].toString(), error: null }
    }
    catch (e) {
        return { data: null, error: `Error running query '${query}': ${e}` }
    }
}

/** 
 * Executes an Oracle query to get a row count, returns a DbResponse type object including the number of rows and error text or null.
 * 
 * This function is called via cypress.config.ts using `cy.task('selectCount', query)`
 */
export async function selectCount(query: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    try {
        let result = await connection.execute(query)
        return { data: parseInt(result['rows'][0].toString()), error: null }
    }
    catch (e) {
        return { data: null, error: `Error running query '${query}': ${e}` }
    }

}

/** 
 * Generic function to execute an Oracle query to get some results.
 * Returns a DbResponse type object, with a 2-d string array for data, and a string (or null) for errors.
 * 
 * Should be called from cy.task, e.g. `cy.task('getData', query).as('data').then((data: string[][]) => {})`
 */
export async function selectData(query: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    try {
        const result = await connection.execute(query, [], { resultSet: true })
        const returnVal: string[][] = []

        const rs = result.resultSet
        let row: object[]

        while (row = await rs.getRow() as object[]) {

            let rowStrings: string[] = []
            row.forEach((col) => {
                rowStrings.push(col?.toString() ?? null)
            })
            returnVal.push(rowStrings)
        }
        await rs.close()

        return { data: returnVal, error: null }
    }
    catch (e) {
        return { data: null, error: `Error running query '${query}': ${e}` }
    }
}


let lastElogTimeAtStart: string = null
let unprocEventTimeAtStart: string = null

export async function getLatestElogAndUnprocEventTime(mode: 'store' | 'check') {

    const elogQuery = `select to_char(time_stamp, 'YYYY-MM-DD HH24:MI:SS') from elog 
                        where error_stack not like '%STUB:%'
                        and (username like 'AUTO%${userSuffix}' or username = 'EOR')
                        order by time_stamp desc fetch first 1 row only`

    const unprocEventQuery = `select to_char(create_date, 'YYYY-MM-DD HH24:MI:SS') from san_unprocessed_events 
                        where create_user like 'AUTO%${userSuffix}'
                        order by create_date desc fetch first 1 row only`

    let result = await selectData(elogQuery)
    if (result.error != null) { // database error
        throw new Error(result.error)
    } else {
        const data = result.data as string[][]
        const lastElogTime = data.length == 0 ? '' : data[0][0]
        if (mode == 'store') {
            lastElogTimeAtStart = lastElogTime
        } else {
            if (lastElogTime != lastElogTimeAtStart && lastElogTimeAtStart != null) {
                throw new Error(`Error checking eLog - last entry was ${lastElogTimeAtStart} at start, now ${lastElogTime}`)
            }
        }
    }

    result = await selectData(unprocEventQuery)

    if (result.error != null) { // database error
        if (!result.error.includes('table or view does not exist')) {    // Ignore this check if unprocessed events table does not exist
            throw new Error(result.error)
        }
    } else {
        const data = result.data as string[][]
        const lastEventTime = data.length == 0 ? '' : data[0][0]
        if (mode == 'store') {
            unprocEventTimeAtStart = lastEventTime
        } else {
            if (lastEventTime != unprocEventTimeAtStart && unprocEventTimeAtStart != null) {
                throw new Error(`Error checking unprocessed events table - last entry was ${unprocEventTimeAtStart} at start, now ${lastEventTime}`)
            }
        }
    }

}


/** 
 * Executes an Oracle update to set a password for a given user.
 * 
 * This function is called via cypress.config.ts using `cy.task('setPassword', {username: 'user', password: 'password'})`
 */
export async function setPassword(username: string, password: string): Promise<DbResponse> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return { data: null, error: connectError }
    }

    const update = `BEGIN
                        update oasys_user set password_encrypted = authentication_pkg.encrypt_password('${password}'), 
                            password_change_date = sysdate, user_status_elm = 'ACTIVE' where oasys_user_code = '${username}';
                        COMMIT;
                    END;`

    try {
        let result = await connection.execute(update)
        return { data: null, error: null }
    }
    catch (e) {
        return { data: null, error: `Error running password update '${update}': ${e}` }
    }
}

