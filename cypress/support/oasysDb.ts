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

/** 
 * 
 */
export async function getOgrsResult(query: string): Promise<string> {

    if (connection == null) {
        const connectError = await connect()
        if (connectError != null) return null
    }

    try {

        const result = await connection.execute(`
            DECLARE result eor.ogrs4_output_typ;
            BEGIN
                result := ${query};
                :ret := 
                    result.OGRS4G_CALCULATED || ',' ||
                    result.OGRS4G_YEAR_TWO || ',' ||
                    result.OGRS4G_AAEAD || ',' ||
                    result.OGRS4G_FEMALE || ',' ||
                    result.OGRS4G_OFFENCE || ',' ||
                    result.OGRS4G_FIRST_SANCTION || ',' ||
                    result.OGRS4G_SECOND_SANCTION || ',' ||
                    result.OGRS4G_TOTAL_SANCTIONS || ',' ||
                    result.OGRS4G_SECOND_SANCTION_GAP || ',' ||
                    result.OGRS4G_OFM || ',' ||
                    result.OGRS4G_COPASG || ',' ||
                    result.OGRS4G_COPASG_SQUARED || ',' ||
                    result.OGRS4G_SCORE || ',' ||
                    result.OGRS4G_PERCENTAGE || ',' ||
                    result.OGRS4G_BAND || ',' ||
                    '''' || result.OGRS4G_MISSING_QUESTIONS || ''',' ||
                    result.OGRS4G_MISSING_COUNT || ',' ||
                    result.OGRS4V_CALCULATED || ',' ||
                    result.OGRS4V_YEAR_TWO || ',' ||
                    result.OGRS4V_AAEAD || ',' ||
                    result.OGRS4V_FEMALE || ',' ||
                    result.OGRS4V_OFFENCE || ',' ||
                    result.OGRS4V_FIRST_SANCTION || ',' ||
                    result.OGRS4V_SECOND_SANCTION || ',' ||
                    result.OGRS4V_TOTAL_SANCTIONS || ',' ||
                    result.OGRS4V_SECOND_SANCTION_GAP || ',' ||
                    result.OGRS4V_OFM || ',' ||
                    result.OGRS4V_COPASV || ',' ||
                    result.OGRS4V_NEVER_VIOLENT || ',' ||
                    result.OGRS4V_ONCE_VIOLENT || ',' ||
                    result.OGRS4V_TOT_VIOLENT_SANCTIONS || ',' ||
                    result.OGRS4V_COPAS_VIOLENT || ',' ||
                    result.OGRS4V_SCORE || ',' ||
                    result.OGRS4V_PERCENTAGE || ',' ||
                    result.OGRS4V_BAND || ',' ||
                    '''' || result.OGRS4V_MISSING_QUESTIONS || ''',' ||
                    result.OGRS4V_MISSING_COUNT || ',' ||
                    result.SNSV_CALCULATED_STATIC || ',' ||
                    result.SNSV_YEAR_TWO_STATIC || ',' ||
                    result.SNSV_AAEAD_STATIC || ',' ||
                    result.SNSV_FEMALE_STATIC || ',' ||
                    result.SNSV_OFFENCE_STATIC || ',' ||
                    result.SNSV_FIRST_SANCTION_STATIC || ',' ||
                    result.SNSV_SECOND_SANCTION_STATIC || ',' ||
                    result.SNSV_TOTAL_SANCTIONS_STATIC || ',' ||
                    result.SNSV_SECOND_SANC_GAP_STATIC || ',' ||
                    result.SNSV_OFM_STATIC || ',' ||
                    result.SNSV_COPASV_STATIC || ',' ||
                    result.SNSV_NEVER_VIOLENT_STATIC || ',' ||
                    result.SNSV_ONCE_VIOLENT_STATIC || ',' ||
                    result.SNSV_TOT_VIOLENT_SANC_STATIC || ',' ||
                    result.SNSV_COPAS_VIOLENT_STATIC || ',' ||
                    result.SNSV_SCORE_STATIC || ',' ||
                    result.SNSV_PERCENTAGE_STATIC || ',' ||
                    result.SNSV_BAND_STATIC || ',' ||
                    '''' || result.SNSV_MISSING_QUESTIONS_STATIC || ''',' ||
                    result.SNSV_MISSING_COUNT_STATIC || ',' ||
                    result.OGP2_CALCULATED || ',' ||
                    result.OGP2_YEAR_TWO || ',' ||
                    result.OGP2_AAEAD || ',' ||
                    result.OGP2_FEMALE || ',' ||
                    result.OGP2_OFFENCE || ',' ||
                    result.OGP2_FIRST_SANCTION || ',' ||
                    result.OGP2_SECOND_SANCTION || ',' ||
                    result.OGP2_TOTAL_SANCTIONS || ',' ||
                    result.OGP2_SECOND_SANCTION_GAP || ',' ||
                    result.OGP2_OFM || ',' ||
                    result.OGP2_COPASG || ',' ||
                    result.OGP2_COPASG_SQUARED || ',' ||
                    result.OGP2_SUITABLE_ACC || ',' ||
                    result.OGP2_UNEMPLOYED || ',' ||
                    result.OGP2_LIVE_IN_RELATIONSHIP || ',' ||
                    result.OGP2_RELATIONSHIP || ',' ||
                    result.OGP2_MULTIPLIC_RELATIONSHIP || ',' ||
                    result.OGP2_DV || ',' ||
                    result.OGP2_REGULAR_ACTIVITIES || ',' ||
                    result.OGP2_DAILY_DRUG_USER || ',' ||
                    result.OGP2_DRUG_MOTIVATION || ',' ||
                    result.OGP2_CHRONIC_DRINKER || ',' ||
                    result.OGP2_BINGE_DRINKER || ',' ||
                    result.OGP2_IMPULSIVE || ',' ||
                    result.OGP2_CRIMINAL_ATTITUDE || ',' ||
                    result.OGP2_HEROIN || ',' ||
                    result.OGP2_METHADONE || ',' ||
                    result.OGP2_OTHER_OPIATE || ',' ||
                    result.OGP2_CRACK || ',' ||
                    result.OGP2_COCAINE || ',' ||
                    result.OGP2_MISUSE_PRESCRIBED || ',' ||
                    result.OGP2_BENZOS || ',' ||
                    result.OGP2_AMPHETAMINES || ',' ||
                    result.OGP2_ECSTASY || ',' ||
                    result.OGP2_CANNABIS || ',' ||
                    result.OGP2_STEROIDS || ',' ||
                    result.OGP2_OTHER_DRUGS || ',' ||
                    result.OGP2_TOTAL_SCORE || ',' ||
                    result.OGP2_PERCENTAGE || ',' ||
                    result.OGP2_BAND || ',' ||
                    '''' || result.OGP2_MISSING_QUESTIONS || ''',' ||
                    result.OGP2_MISSING_COUNT || ',' ||
                    result.OVP2_CALCULATED || ',' ||
                    result.OVP2_YEAR_TWO || ',' ||
                    result.OVP2_AAEAD || ',' ||
                    result.OVP2_FEMALE || ',' ||
                    result.OVP2_OFFENCE || ',' ||
                    result.OVP2_FIRST_SANCTION || ',' ||
                    result.OVP2_SECOND_SANCTION || ',' ||
                    result.OVP2_TOTAL_SANCTIONS || ',' ||
                    result.OVP2_SECOND_SANCTION_GAP || ',' ||
                    result.OVP2_OFM || ',' ||
                    result.OVP2_COPASV || ',' ||
                    result.OVP2_NEVER_VIOLENT || ',' ||
                    result.OVP2_ONCE_VIOLENT || ',' ||
                    result.OVP2_TOTAL_VIOLENT_SANCTIONS || ',' ||
                    result.OVP2_COPAS_VIOLENT || ',' ||
                    result.OVP2_SUITABLE_ACC || ',' ||
                    result.OVP2_UNEMPLOYED || ',' ||
                    result.OVP2_RELATIONSHIP || ',' ||
                    result.OVP2_LIVE_IN_RELATIONSHIP || ',' ||
                    result.OVP2_MULTIPLIC_RELATIONSHIP || ',' ||
                    result.OVP2_DV || ',' ||
                    result.OVP2_REGULAR_ACTIVITIES || ',' ||
                    result.OVP2_DRUG_MOTIVATION || ',' ||
                    result.OVP2_CHRONIC_DRINKER || ',' ||
                    result.OVP2_BINGE_DRINKER || ',' ||
                    result.OVP2_IMPULSIVE || ',' ||
                    result.OVP2_TEMPER || ',' ||
                    result.OVP2_CRIMINAL_ATTITUDE || ',' ||
                    result.OVP2_HEROIN || ',' ||
                    result.OVP2_CRACK || ',' ||
                    result.OVP2_COCAINE || ',' ||
                    result.OVP2_MISUSE_PRESCRIBED || ',' ||
                    result.OVP2_BENZOS || ',' ||
                    result.OVP2_AMPHETAMINES || ',' ||
                    result.OVP2_ECSTASY || ',' ||
                    result.OVP2_CANNABIS || ',' ||
                    result.OVP2_STEROIDS || ',' ||
                    result.OVP2_TOTAL_SCORE || ',' ||
                    result.OVP2_PERCENTAGE || ',' ||
                    result.OVP2_BAND || ',' ||
                    '''' || result.OVP2_MISSING_QUESTIONS || ''',' ||
                    result.OVP2_MISSING_COUNT || ',' ||
                    result.SNSV_CALCULATED_DYNAMIC || ',' ||
                    result.SNSV_YEAR_TWO_DYNAMIC || ',' ||
                    result.SNSV_AAEAD_DYNAMIC || ',' ||
                    result.SNSV_FEMALE_DYNAMIC || ',' ||
                    result.SNSV_OFFENCE_DYNAMIC || ',' ||
                    result.SNSV_FIRST_SANCTION_DYNAMIC || ',' ||
                    result.SNSV_SECOND_SANCTION_DYNAMIC || ',' ||
                    result.SNSV_TOTAL_SANCTIONS_DYNAMIC || ',' ||
                    result.SNSV_SECOND_SANC_GAP_DYNAMIC || ',' ||
                    result.SNSV_OFM_DYNAMIC || ',' ||
                    result.SNSV_COPASV_DYNAMIC || ',' ||
                    result.SNSV_NEVER_VIOLENT_DYNAMIC || ',' ||
                    result.SNSV_ONCE_VIOLENT_DYNAMIC || ',' ||
                    result.SNSV_TOT_VIOLENT_SANC_DYNAMIC || ',' ||
                    result.SNSV_COPAS_VIOLENT_DYNAMIC || ',' ||
                    result.SNSV_WEAPON_DYNAMIC || ',' ||
                    result.SNSV_SUITABLE_ACC_DYNAMIC || ',' ||
                    result.SNSV_UNEMPLOYED_DYNAMIC || ',' ||
                    result.SNSV_RELATION_QUALITY_DYNAMIC || ',' ||
                    result.SNSV_DV_DYNAMIC || ',' ||
                    result.SNSV_CHRONIC_DRINKER_DYNAMIC || ',' ||
                    result.SNSV_BINGE_DRINKER_DYNAMIC || ',' ||
                    result.SNSV_IMPULSIVE_DYNAMIC || ',' ||
                    result.SNSV_TEMPER_DYNAMIC || ',' ||
                    result.SNSV_CRIM_ATTITUDE_DYNAMIC || ',' ||
                    result.SNSV_HOMICIDE_DYNAMIC || ',' ||
                    result.SNSV_GBH_DYNAMIC || ',' ||
                    result.SNSV_KIDNAP_DYNAMIC || ',' ||
                    result.SNSV_FIREARMS_DYNAMIC || ',' ||
                    result.SNSV_ROBBERY_DYNAMIC || ',' ||
                    result.SNSV_AGG_BURGLARY_DYNAMIC || ',' ||
                    result.SNSV_WEAPONS_NOT_GUNS_DYNAMIC || ',' ||
                    result.SNSV_CRIM_DAMAGE_LIFE_DYNAMIC || ',' ||
                    result.SNSV_ARSON_DYNAMIC || ',' ||
                    result.SNSV_SCORE_DYNAMIC || ',' ||
                    result.SNSV_PERCENTAGE_DYNAMIC || ',' ||
                    result.SNSV_BAND_DYNAMIC || ',' ||
                    '''' || result.SNSV_MISSING_QUESTIONS_DYNAMIC || ''',' ||
                    result.SNSV_MISSING_COUNT_DYNAMIC || ',' ||
                    result.OSP_DC_CALCULATED || ',' ||
                    result.OSP_DC_SCORE || ',' ||
                    result.OSP_DC_PERCENTAGE || ',' ||
                    result.OSP_DC_BAND || ',' ||
                    result.OSP_DC_RISK_REDUCTION || ',' ||
                    '''' || result.OSP_DC_MISSING_QUESTIONS || ''',' ||
                    result.OSP_DC_MISSING_COUNT || ',' ||
                    result.OSP_IIC_CALCULATED || ',' ||
                    result.OSP_IIC_PERCENTAGE || ',' ||
                    result.OSP_IIC_BAND || ',' ||
                    '''' || result.OSP_IIC_MISSING_QUESTIONS || ''',' ||
                    result.OSP_IIC_MISSING_COUNT || ',' ||
                    result.RSR_CALCULATED || ',' ||
                    result.RSR_DYNAMIC || ',' ||
                    result.RSR_PERCENTAGE || ',' ||
                    result.RSR_BAND || ',' ||
                    '''' || result.RSR_MISSING_QUESTIONS || ''',' ||
                    result.RSR_MISSING_COUNT
                    ;
                END;`,
            {
                ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10000 }
            }
        )

        return result.outBinds.ret
    }
    catch (e) {
        console.log(e)
        console.log(query)
        console.log('')
        return null
    }
}


let lastElogTimeAtStart: string = null
let unprocEventTimeAtStart: string = null

export async function getLatestElogAndUnprocEventTime(mode: 'store' | 'check') {

    const elogQuery = `select to_char(time_stamp, 'YYYY-MM-DD HH24:MI:SS') from eor.elog 
                        where error_stack not like '%STUB:%'
                        and (username like 'AUTO%${userSuffix}' or username = 'EOR')
                        order by time_stamp desc fetch first 1 row only`

    const unprocEventQuery = `select to_char(create_date, 'YYYY-MM-DD HH24:MI:SS') from eor.san_unprocessed_events 
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
