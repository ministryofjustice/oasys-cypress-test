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
                    result.ogrs4g_calculated || ',' ||
                    result.ogrs4g_year_two || ',' ||
                    result.ogrs4g_aaead || ',' ||
                    result.ogrs4g_female || ',' ||
                    result.ogrs4g_offence || ',' ||
                    result.ogrs4g_first_sanction || ',' ||
                    result.ogrs4g_second_sanction || ',' ||
                    result.ogrs4g_total_sanctions || ',' ||
                    result.ogrs4g_second_sanction_gap || ',' ||
                    result.ogrs4g_ofm || ',' ||
                    result.ogrs4g_copasg || ',' ||
                    result.ogrs4g_copasg_squared || ',' ||
                    result.ogrs4g_score || ',' ||
                    result.ogrs4g_percentage || ',' ||
                    result.ogrs4g_band || ',' ||
                    result.ogrs4g_missing_questions || ',' ||
                    result.ogrs4g_missing_count || ',' ||
                    result.ogrs4v_calculated || ',' ||
                    result.ogrs4v_year_two || ',' ||
                    result.ogrs4v_aaead || ',' ||
                    result.ogrs4v_female || ',' ||
                    result.ogrs4v_offence || ',' ||
                    result.ogrs4v_first_sanction || ',' ||
                    result.ogrs4v_second_sanction || ',' ||
                    result.ogrs4v_total_sanctions || ',' ||
                    result.ogrs4v_second_sanction_gap || ',' ||
                    result.ogrs4v_ofm || ',' ||
                    result.ogrs4v_never_violent || ',' ||
                    result.ogrs4v_once_violent || ',' ||
                    result.ogrs4v_tot_violent_sanctions || ',' ||
                    result.ogrs4v_copas_violent || ',' ||
                    result.ogrs4v_score || ',' ||
                    result.ogrs4v_percentage || ',' ||
                    result.ogrs4v_band || ',' ||
                    result.ogrs4v_missing_questions || ',' ||
                    result.ogrs4v_missing_count || ',' ||
                    result.snsv_calculated_static || ',' ||
                    result.snsv_year_two_static || ',' ||
                    result.snsv_aaead_static || ',' ||
                    result.snsv_female_static || ',' ||
                    result.snsv_offence_static || ',' ||
                    result.snsv_first_sanction_static || ',' ||
                    result.snsv_second_sanction_static || ',' ||
                    result.snsv_total_sanctions_static || ',' ||
                    result.snsv_second_sanc_gap_static || ',' ||
                    result.snsv_ofm_static || ',' ||
                    result.snsv_copasv_static || ',' ||
                    result.snsv_never_violent_static || ',' ||
                    result.snsv_once_violent_static || ',' ||
                    result.snsv_tot_violent_sanc_static || ',' ||
                    result.snsv_copas_violent_static || ',' ||
                    result.snsv_score_static || ',' ||
                    result.snsv_percentage_yr2_static || ',' ||
                    result.snsv_band_static || ',' ||
                    result.snsv_missing_questions_static || ',' ||
                    result.snsv_missing_count_static || ',' ||
                    result.ogp2_calculated || ',' ||
                    result.ogp2_year_two || ',' ||
                    result.ogp2_aaead || ',' ||
                    result.ogp2_female || ',' ||
                    result.ogp2_offence || ',' ||
                    result.ogp2_first_sanction || ',' ||
                    result.ogp2_second_sanction || ',' ||
                    result.ogp2_total_sanctions || ',' ||
                    result.ogp2_second_sanction_gap || ',' ||
                    result.ogp2_ofm || ',' ||
                    result.ogp2_copasg || ',' ||
                    result.ogp2_copasg_squared || ',' ||
                    result.ogp2_suitable_acc || ',' ||
                    result.ogp2_unemployed || ',' ||
                    result.ogp2_live_in_relationship || ',' ||
                    result.ogp2_relationship || ',' ||
                    result.ogp2_multiplic_relationship || ',' ||
                    result.ogp2_dv || ',' ||
                    result.ogp2_regular_activities || ',' ||
                    result.ogp2_daily_drug_user || ',' ||
                    result.ogp2_drug_motivation || ',' ||
                    result.ogp2_chronic_drinker || ',' ||
                    result.ogp2_binge_drinker || ',' ||
                    result.ogp2_impulsive || ',' ||
                    result.ogp2_criminal_attitude || ',' ||
                    result.ogp2_heroin || ',' ||
                    result.ogp2_methadone || ',' ||
                    result.ogp2_other_opiate || ',' ||
                    result.ogp2_crack || ',' ||
                    result.ogp2_cocaine || ',' ||
                    result.ogp2_misuse_prescribed || ',' ||
                    result.ogp2_benzos || ',' ||
                    result.ogp2_amphetamines || ',' ||
                    result.ogp2_ecstasy || ',' ||
                    result.ogp2_cannabis || ',' ||
                    result.ogp2_steroids || ',' ||
                    result.ogp2_other_drugs || ',' ||
                    result.ogp2_total_score_yr2 || ',' ||
                    result.ogp2_percentage_yr2 || ',' ||
                    result.ogp2_band || ',' ||
                    result.ogp2_missing_questions || ',' ||
                    result.ogp2_missing_count || ',' ||
                    result.ovp2_calculated || ',' ||
                    result.ovp2_year_two || ',' ||
                    result.ovp2_aaead || ',' ||
                    result.ovp2_female || ',' ||
                    result.ovp2_offence || ',' ||
                    result.ovp2_first_sanction || ',' ||
                    result.ovp2_second_sanction || ',' ||
                    result.ovp2_total_sanctions || ',' ||
                    result.ovp2_second_sanction_gap || ',' ||
                    result.ovp2_ofm || ',' ||
                    result.ovp2_copasv || ',' ||
                    result.ovp2_never_violent || ',' ||
                    result.ovp2_once_violent || ',' ||
                    result.ovp2_total_violent_sanctions || ',' ||
                    result.ovp2_copas_violent || ',' ||
                    result.ovp2_suitable_acc || ',' ||
                    result.ovp2_unemployed || ',' ||
                    result.ovp2_relationship || ',' ||
                    result.ovp2_live_in_relationship || ',' ||
                    result.ovp2_multiplic_relationship || ',' ||
                    result.ovp2_dv || ',' ||
                    result.ovp2_regular_activities || ',' ||
                    result.ovp2_drug_motivation || ',' ||
                    result.ovp2_chronic_drinker || ',' ||
                    result.ovp2_binge_drinker || ',' ||
                    result.ovp2_impulsive || ',' ||
                    result.ovp2_temper || ',' ||
                    result.ovp2_criminal_attitude || ',' ||
                    result.ovp2_heroin || ',' ||
                    result.ovp2_crack || ',' ||
                    result.ovp2_cocaine || ',' ||
                    result.ovp2_misuse_prescribed || ',' ||
                    result.ovp2_benzos || ',' ||
                    result.ovp2_amphetamines || ',' ||
                    result.ovp2_ecstasy || ',' ||
                    result.ovp2_cannabis || ',' ||
                    result.ovp2_steroids || ',' ||
                    result.ovp2_total_score_yr2 || ',' ||
                    result.ovp2_percentage_yr2 || ',' ||
                    result.ovp2_band || ',' ||
                    result.ovp2_missing_questions || ',' ||
                    result.ovp2_missing_count || ',' ||
                    result.snsv_calculated_dynamic || ',' ||
                    result.snsv_year_two_dynamic || ',' ||
                    result.snsv_aaead_dynamic || ',' ||
                    result.snsv_female_dynamic || ',' ||
                    result.snsv_offence_dynamic || ',' ||
                    result.snsv_first_sanction_dynamic || ',' ||
                    result.snsv_second_sanction_dynamic || ',' ||
                    result.snsv_total_sanctions_dynamic || ',' ||
                    result.snsv_second_sanc_gap_dynamic || ',' ||
                    result.snsv_ofm_dynamic || ',' ||
                    result.snsv_copasv_dynamic || ',' ||
                    result.snsv_never_violent_dynamic || ',' ||
                    result.snsv_once_violent_dynamic || ',' ||
                    result.snsv_tot_violent_sanc_dynamic || ',' ||
                    result.snsv_copas_violent_dynamic || ',' ||
                    result.snsv_weapon_dynamic || ',' ||
                    result.snsv_suitable_acc_dynamic || ',' ||
                    result.snsv_unemployed_dynamic || ',' ||
                    result.snsv_relation_quality_dynamic || ',' ||
                    result.snsv_dv_dynamic || ',' ||
                    result.snsv_chronic_drinker_dynamic || ',' ||
                    result.snsv_binge_drinker_dynamic || ',' ||
                    result.snsv_impulsive_dynamic || ',' ||
                    result.snsv_temper_dynamic || ',' ||
                    result.snsv_crim_attitude_dynamic || ',' ||
                    result.snsv_homicide_dynamic || ',' ||
                    result.snsv_gbh_dynamic || ',' ||
                    result.snsv_kidnap_dynamic || ',' ||
                    result.snsv_firearms_dynamic || ',' ||
                    result.snsv_robbery_dynamic || ',' ||
                    result.snsv_agg_burglary_dynamic || ',' ||
                    result.snsv_weapons_not_guns_dynamic || ',' ||
                    result.snsv_crim_damage_life_dynamic || ',' ||
                    result.snsv_arson_dynamic || ',' ||
                    result.snsv_score_dynamic || ',' ||
                    result.snsv_percentage_dynamic || ',' ||
                    result.snsv_band_dynamic || ',' ||
                    result.snsv_missed_questions_dynamic || ',' ||
                    result.snsv_missing_count_dynamic || ',' ||
                    result.osp_dc_calculated || ',' ||
                    result.osp_dc_score || ',' ||
                    result.osp_dc_percentage || ',' ||
                    result.osp_dc_band || ',' ||
                    result.osp_dc_risk_reduction || ',' ||
                    result.osp_iic_calculated || ',' ||
                    result.osp_iic_percentage || ',' ||
                    result.osp_iic_band || ',' ||
                    result.rsr_calculated || ',' ||
                    result.rsr_dynamic || ',' ||
                    result.RSR_PERCENTAGE || ',' ||
                    result.RSR_BAND || ',' ||
                    '''' || result.RSR_MISSING_QUESTIONS || ''',' ||
                    result.RSR_MISSING_COUNT;

                END;`,
            {
                ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10000 }
            }
        )
        return result.outBinds.ret
    }
    catch (e) {
        console.log(e)
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
