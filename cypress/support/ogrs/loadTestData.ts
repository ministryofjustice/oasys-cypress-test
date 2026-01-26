import { Decimal } from 'decimal.js'

import { TestCaseParameters, OutputParameters } from '../../../oasys/lib/ogrs/types'
import { createOutputObject } from 'lib/ogrs/createOutput'
import { addCalculatedInputParameters } from 'lib/ogrs/common'
import { getDate, getInteger, getString } from 'lib/utils'

export function loadParameterSet(parameterLine: string): TestCaseParameters {

    const parameters = parameterLine.split(',')
    let i = 0

    const p: TestCaseParameters = {
        ASSESSMENT_DATE: getDate(parameters[i++]),
        STATIC_CALC: getString(parameters[i++]),
        DOB: getDate(parameters[i++]),
        GENDER: getString(parameters[i++]),
        OFFENCE_CODE: getString(parameters[i++]),
        TOTAL_SANCTIONS_COUNT: getInteger(parameters[i++]),
        TOTAL_VIOLENT_SANCTIONS: getInteger(parameters[i++]),
        CONTACT_ADULT_SANCTIONS: getInteger(parameters[i++]),
        CONTACT_CHILD_SANCTIONS: getInteger(parameters[i++]),
        INDECENT_IMAGE_SANCTIONS: getInteger(parameters[i++]),
        PARAPHILIA_SANCTIONS: getInteger(parameters[i++]),
        STRANGER_VICTIM: getString(parameters[i++]),
        AGE_AT_FIRST_SANCTION: getInteger(parameters[i++]),
        LAST_SANCTION_DATE: getDate(parameters[i++]),
        DATE_RECENT_SEXUAL_OFFENCE: getDate(parameters[i++]),
        CURR_SEX_OFF_MOTIVATION: getString(parameters[i++]),
        MOST_RECENT_OFFENCE: getDate(parameters[i++]),
        COMMUNITY_DATE: getDate(parameters[i++]),
        ONE_POINT_THIRTY: getString(parameters[i++]),
        TWO_POINT_TWO: getInteger(parameters[i++]),
        THREE_POINT_FOUR: getInteger(parameters[i++]),
        FOUR_POINT_TWO: getInteger(parameters[i++]),
        SIX_POINT_FOUR: getInteger(parameters[i++]),
        SIX_POINT_SEVEN: getInteger(parameters[i++]),
        SIX_POINT_EIGHT: getInteger(parameters[i++]),
        SEVEN_POINT_TWO: getInteger(parameters[i++]),
        DAILY_DRUG_USER: getString(parameters[i++]),
        AMPHETAMINES: getString(parameters[i++]),
        BENZODIAZIPINES: getString(parameters[i++]),
        CANNABIS: getString(parameters[i++]),
        CRACK_COCAINE: getString(parameters[i++]),
        ECSTASY: getString(parameters[i++]),
        HALLUCINOGENS: getString(parameters[i++]),
        HEROIN: getString(parameters[i++]),
        KETAMINE: getString(parameters[i++]),
        METHADONE: getString(parameters[i++]),
        MISUSED_PRESCRIBED: getString(parameters[i++]),
        OTHER_DRUGS: getString(parameters[i++]),
        OTHER_OPIATE: getString(parameters[i++]),
        POWDER_COCAINE: getString(parameters[i++]),
        SOLVENTS: getString(parameters[i++]),
        SPICE: getString(parameters[i++]),
        STEROIDS: getString(parameters[i++]),
        EIGHT_POINT_EIGHT: getInteger(parameters[i++]),
        NINE_POINT_ONE: getInteger(parameters[i++]),
        NINE_POINT_TWO: getInteger(parameters[i++]),
        ELEVEN_POINT_TWO: getInteger(parameters[i++]),
        ELEVEN_POINT_FOUR: getInteger(parameters[i++]),
        TWELVE_POINT_ONE: getInteger(parameters[i++]),
        OGRS4G_ALGO_VERSION: getInteger(parameters[i++]),
        OGRS4V_ALGO_VERSION: getInteger(parameters[i++]),
        OGP2_ALGO_VERSION: getInteger(parameters[i++]),
        OVP2_ALGO_VERSION: getInteger(parameters[i++]),
        OSP_ALGO_VERSION: getInteger(parameters[i++]),
        SNSV_ALGO_VERSION: getInteger(parameters[i++]),
        AGGRAVATED_BURGLARY: getInteger(parameters[i++]),
        ARSON: getInteger(parameters[i++]),
        CRIMINAL_DAMAGE_LIFE: getInteger(parameters[i++]),
        FIREARMS: getInteger(parameters[i++]),
        GBH: getInteger(parameters[i++]),
        HOMICIDE: getInteger(parameters[i++]),
        KIDNAP: getInteger(parameters[i++]),
        ROBBERY: getInteger(parameters[i++]),
        WEAPONS_NOT_FIREARMS: getInteger(parameters[i++]),
        CUSTODY_IND: getString(parameters[i++]),
    }

    addCalculatedInputParameters(p)
    return p
}

export function loadOracleOutputValues(values: string[]): OutputParameters {

    const expectedOutputParameters = createOutputObject()

    let i = 0
    Object.keys(expectedOutputParameters).forEach((param) => {
        const stringValue = values[i++]
        const isNumeric = !Number.isNaN(Number.parseFloat(stringValue))
        expectedOutputParameters[param] = isNumeric ? new Decimal(stringValue) : stringValue == '' ? null : stringValue
    })

    return expectedOutputParameters
}
