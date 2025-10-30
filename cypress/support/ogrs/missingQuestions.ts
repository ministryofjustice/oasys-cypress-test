import { TestCaseParameters, ScoreType, MissingQuestionsResult } from './types'

export function checkMissingQuestions(scoreType: ScoreType, params: TestCaseParameters, rsrDynamic: boolean = false): MissingQuestionsResult {

    const missing: string[] = []
    const paramListId = scoreType == 'rsr' ? (rsrDynamic ? 'rsr_extended' : 'rsr_brief') : scoreType
    const required = requiredParams[paramListId]

    // OSP special rules
    if (['osp_c', 'osp_i'].includes(scoreType)) {
        if (params.female) {
            if (params.ONE_POINT_THIRTY == 'Y' && params.zeroSexualSanctions) {
                return { status: 'E', count: 1, errorText: `'${errorTextScoreName['SEXUAL_SANCTION_SCORES']}\n'` }
            } else {
                return { status: 'A', count: 0, errorText: `''` }
            }
        } else if (!params.male && params.GENDER != null) {
            return { status: 'A', count: 0, errorText: `'${errorTextScoreName[scoreType]} can't be calculated on gender other than Male.'` }
        }
        if (params.ONE_POINT_THIRTY == 'N') {
            return { status: 'A', count: 0, errorText: `''` }
        }
        if (params.GENDER == null) {
            return { status: 'E', count: 1, errorText: `'Gender\n'` }
        }
        if (params.ONE_POINT_THIRTY == null) {
            return { status: 'E', count: 1, errorText: `'1.30 Have they ever committed a sexual or sexually motivated offence?\n'` }
        }
    }

    // Not male or female
    if (!params.male && !params.female && params.GENDER != null) {
        return { status: 'E', count: 0, errorText: `'${errorTextScoreName[scoreType]} can't be calculated on gender other than Male and Female.'` }
    }

    // RSR special rules
    if (scoreType == 'rsr' && params.female && params.ONE_POINT_THIRTY == 'Y' && params.zeroSexualSanctions) {
        return { status: 'E', count: 1, errorText: `'${errorTextScoreName['SEXUAL_SANCTION_SCORES']}\n'` }
    }

    // Standard missing questions
    standardCheck(params, required, missing, 'ONE_POINT_THIRTY')
    standardCheck(params, required, missing, 'DOB')

    if (params.LAST_SANCTION_DATE == null && (required.includes('LAST_SANCTION_DATE') || (scoreType == 'osp_c' && params.COMMUNITY_DATE == null))) {
        missing.push(getErrorText('LAST_SANCTION_DATE'))
    }
    standardCheck(params, required, missing, 'AGE_AT_FIRST_SANCTION')
    standardCheck(params, required, missing, 'GENDER')

    if (params.OFFENCE_CODE == null && required.includes('OFFENCE_CODE')) {
        missing.push(getErrorText('OFFENCE_CODE'))
    } else if (params.OFFENCE_CODE && !params.offenceCat) {
        // Invalid offence code
        missing.push(scoreType == 'serious_violence_brief' ? 'Offence Code' : 'Offence Code Invalid')
    }

    standardCheck(params, required, missing, 'TOTAL_SANCTIONS_COUNT')

    if (params.COMMUNITY_DATE == null && required.includes('COMMUNITY_DATE') && params.LAST_SANCTION_DATE == null) {
        missing.push(getErrorText('COMMUNITY_DATE'))
    }
    standardCheck(params, required, missing, 'TOTAL_VIOLENT_SANCTIONS')
    standardCheck(params, required, missing, 'TWO_POINT_TWO')
    standardCheck(params, required, missing, 'THREE_POINT_FOUR')
    standardCheck(params, required, missing, 'FOUR_POINT_TWO')
    standardCheck(params, required, missing, 'SIX_POINT_FOUR')
    standardCheck(params, required, missing, 'SIX_POINT_SEVEN')
    standardCheck(params, required, missing, 'SIX_POINT_EIGHT')
    standardCheck(params, required, missing, 'SEVEN_POINT_TWO')
    standardCheck(params, required, missing, 'DAILY_DRUG_USER')
    standardCheck(params, required, missing, 'EIGHT_POINT_EIGHT')
    standardCheck(params, required, missing, 'NINE_POINT_ONE')
    standardCheck(params, required, missing, 'NINE_POINT_TWO')
    standardCheck(params, required, missing, 'ELEVEN_POINT_TWO')
    standardCheck(params, required, missing, 'ELEVEN_POINT_FOUR')
    standardCheck(params, required, missing, 'TWELVE_POINT_ONE')
    standardCheck(params, required, missing, 'HOMICIDE')
    standardCheck(params, required, missing, 'GBH')
    standardCheck(params, required, missing, 'KIDNAP')
    standardCheck(params, required, missing, 'FIREARMS')
    standardCheck(params, required, missing, 'ROBBERY')
    standardCheck(params, required, missing, 'AGGRAVATED_BURGLARY')
    standardCheck(params, required, missing, 'WEAPONS_NOT_FIREARMS')
    standardCheck(params, required, missing, 'CRIMINAL_DAMAGE_LIFE')
    standardCheck(params, required, missing, 'ARSON')

    if (['osp_c', 'osp_i', 'rsr'].includes(scoreType) && params.male && params.ONE_POINT_THIRTY == 'Y' && params.zeroSexualSanctions) {
        missing.push(getErrorText('SEXUAL_SANCTION_SCORES'))
    }
    if (scoreType != 'rsr' || (params.male && params.ONE_POINT_THIRTY == 'Y')) {
        standardCheck(params, required, missing, 'CONTACT_ADULT_SANCTIONS')
        standardCheck(params, required, missing, 'CONTACT_CHILD_SANCTIONS')
        standardCheck(params, required, missing, 'INDECENT_IMAGE_SANCTIONS')
        standardCheck(params, required, missing, 'PARAPHILIA_SANCTIONS')
        standardCheck(params, required, missing, 'DATE_RECENT_SEXUAL_OFFENCE')
        standardCheck(params, required, missing, 'CURR_SEX_OFF_MOTIVATION')
    }
    if (['osp_c', 'rsr'].includes(scoreType) && params.male && params.CURR_SEX_OFF_MOTIVATION == 'Y' && params.STRANGER_VICTIM == null) {
        missing.push(getErrorText('STRANGER_VICTIM'))
    }

    // Convert to string with line breaks
    const result = missing.length == 0 ? `''` : `'${missing.join('\n')}\n'`
    return { status: missing.length > 0 ? 'E' : 'Y', count: missing.length, errorText: result }
}

function standardCheck(params: TestCaseParameters, required: string[], missing: string[], param: string) {
    if (params[param] == null && required.includes(param)) {
        missing.push(getErrorText(param))
    }
}

function getErrorText(param: string): string {

    const text = missingText[param]
    return text == undefined ? param : text
}

export const requiredParams = {

    serious_violence_brief: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'TOTAL_VIOLENT_SANCTIONS',
    ],
    serious_violence_extended: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'TOTAL_VIOLENT_SANCTIONS',
        'TWO_POINT_TWO',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
        'HOMICIDE',
        'GBH',
        'KIDNAP',
        'FIREARMS',
        'ROBBERY',
        'AGGRAVATED_BURGLARY',
        'WEAPONS_NOT_FIREARMS',
        'CRIMINAL_DAMAGE_LIFE',
        'ARSON',
    ],
    general_brief: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
    ],
    violence_brief: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'TOTAL_VIOLENT_SANCTIONS',
    ],
    general_extended: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'SIX_POINT_EIGHT',
        'SEVEN_POINT_TWO',
        'DAILY_DRUG_USER',
        'EIGHT_POINT_EIGHT',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'TWELVE_POINT_ONE',

    ],
    violence_extended: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'TOTAL_VIOLENT_SANCTIONS',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'SIX_POINT_EIGHT',
        'SEVEN_POINT_TWO',
        'EIGHT_POINT_EIGHT',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
    ],
    osp_c: [
        'ONE_POINT_THIRTY',
        'DOB',
        'GENDER',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'CONTACT_ADULT_SANCTIONS',
        'CONTACT_CHILD_SANCTIONS',
        'PARAPHILIA_SANCTIONS',
        'DATE_RECENT_SEXUAL_OFFENCE',
        'CURR_SEX_OFF_MOTIVATION',
    ],
    osp_i: [
        'ONE_POINT_THIRTY',
        'GENDER',
        'CONTACT_ADULT_SANCTIONS',
        'CONTACT_CHILD_SANCTIONS',
        'PARAPHILIA_SANCTIONS',
        'INDECENT_IMAGE_SANCTIONS',
    ],
    rsr_brief: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'TOTAL_VIOLENT_SANCTIONS',
        'ONE_POINT_THIRTY',
        'CONTACT_ADULT_SANCTIONS',
        'CONTACT_CHILD_SANCTIONS',
        'PARAPHILIA_SANCTIONS',
        'DATE_RECENT_SEXUAL_OFFENCE',
        'CURR_SEX_OFF_MOTIVATION',
        'INDECENT_IMAGE_SANCTIONS',
    ],
    rsr_extended: [
        'DOB',
        'LAST_SANCTION_DATE',
        'AGE_AT_FIRST_SANCTION',
        'GENDER',
        'OFFENCE_CODE',
        'TOTAL_SANCTIONS_COUNT',
        'COMMUNITY_DATE',
        'TOTAL_VIOLENT_SANCTIONS',
        'TWO_POINT_TWO',
        'THREE_POINT_FOUR',
        'FOUR_POINT_TWO',
        'SIX_POINT_FOUR',
        'SIX_POINT_SEVEN',
        'NINE_POINT_ONE',
        'NINE_POINT_TWO',
        'ELEVEN_POINT_TWO',
        'ELEVEN_POINT_FOUR',
        'TWELVE_POINT_ONE',
        'HOMICIDE',
        'GBH',
        'KIDNAP',
        'FIREARMS',
        'ROBBERY',
        'AGGRAVATED_BURGLARY',
        'WEAPONS_NOT_FIREARMS',
        'CRIMINAL_DAMAGE_LIFE',
        'ARSON',
        'ONE_POINT_THIRTY',
        'CONTACT_ADULT_SANCTIONS',
        'CONTACT_CHILD_SANCTIONS',
        'PARAPHILIA_SANCTIONS',
        'DATE_RECENT_SEXUAL_OFFENCE',
        'CURR_SEX_OFF_MOTIVATION',
        'INDECENT_IMAGE_SANCTIONS',
    ],
}

export const missingText = {
    DOB: 'Date of birth',
    LAST_SANCTION_DATE: '1.29 Date of current conviction',
    AGE_AT_FIRST_SANCTION: 'Age at first sanction',
    GENDER: 'Gender',
    OFFENCE_CODE: 'Offence Code',
    TOTAL_SANCTIONS_COUNT: '1.32 Total number of sanctions for all offences',
    COMMUNITY_DATE: '1.38 Date of commencement of community sentence or earliest possible release from custody',
    TOTAL_VIOLENT_SANCTIONS: '1.40 How many of the total number of sanctions involved violent offences?',
    ONE_POINT_THIRTY: '1.30 Have they ever committed a sexual or sexually motivated offence?',
    TWO_POINT_TWO: '2.2 Did the offence involve carrying or using a weapon',
    THREE_POINT_FOUR: '3.4 Is the offender living in suitable accommodation?',
    FOUR_POINT_TWO: '4.2 Is the person unemployed, or will be unemployed on release?',
    SIX_POINT_FOUR: `6.4 What is the person's current relationship with partner?`,
    SIX_POINT_SEVEN: '6.7 Perpetrator of domestic abuse?',
    SIX_POINT_EIGHT: '6.8 Current Relationship Status',
    SEVEN_POINT_TWO: '7.2 Regular activities encourage offending',
    DAILY_DRUG_USER: '8.1 Drugs ever misused (in custody and community)',
    EIGHT_POINT_EIGHT: '8.8 Motivation to tackle drug misuse',
    NINE_POINT_ONE: '9.1 Is current alcohol use a problem',
    NINE_POINT_TWO: '9.2 Binge drinking or excessive use of alcohol in last 6 months',
    ELEVEN_POINT_TWO: '11.2 Impulsivity',
    ELEVEN_POINT_FOUR: '11.4 Temper control',
    TWELVE_POINT_ONE: '12.1 Pro-criminal attitudes',
    HOMICIDE: 'R1.2 Murder / attempted murder / threat or conspiracy to murder / manslaughter',
    GBH: 'R1.2 Wounding / GBH',
    KIDNAP: 'R1.2 Kidnapping / false imprisonment',
    FIREARMS: 'R1.2 Possession of a firearm with intent to endanger life or resist arrest',
    ROBBERY: 'R1.2 Robbery',
    AGGRAVATED_BURGLARY: 'R1.2 Aggravated burglary',
    WEAPONS_NOT_FIREARMS: 'R1.2 Any offence involving possession and / or use of weapons',
    CRIMINAL_DAMAGE_LIFE: 'R1.2 Criminal damage with the intent to endanger life',
    ARSON: 'R1.2 Arson',
    CONTACT_ADULT_SANCTIONS: '1.34 Number of previous/current sanctions involving contact adult sexual/sexually motivated offences',
    CONTACT_CHILD_SANCTIONS: '1.45 Number of previous/current sanctions involving direct contact child sexual/sexually motivated offences',
    PARAPHILIA_SANCTIONS: '1.37 Number of previous/current sanctions involving other non-contact sexual/sexually motivated offences',
    DATE_RECENT_SEXUAL_OFFENCE: '1.33 Date of most recent sanction involving a sexual/sexually motivated offence',
    CURR_SEX_OFF_MOTIVATION: '1.41 Does the current offence have a sexual motivation?',
    STRANGER_VICTIM: '1.44 Does the current offence involve actual/attempted direct contact against a victim who was a stranger?',
    INDECENT_IMAGE_SANCTIONS: '1.46 Number of previous/current sanctions involving indecent child image or indirect child contact sexual/sexually motivated offences',
    SEXUAL_SANCTION_SCORES: 'Sexual or sexually motivated offence(s) with no sexual sanction counts.',
}

const errorTextScoreName = {
    serious_violence_brief: 'Serious Violent Reoffending Predictor - Static',
    serious_violence_extended: 'Serious Violent Reoffending Predictor - Dynamic',
    general_brief: 'All Reoffending Predictor - Static',
    violence_brief: 'Violent Reoffending Predictor - Static',
    general_extended: 'All Reoffending Predictor - Dynamic',
    violence_extended: 'Violent Reoffending Predictor - Dynamic',
    osp_c: 'Direct Contact - Sexual Reoffending Predictor',
    osp_i: 'Images and Indirect Contact - Sexual Reoffending Predictor',
    rsr: 'Combined Serious Reoffending Predictor',
}
