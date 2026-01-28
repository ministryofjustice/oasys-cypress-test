import { calculate } from 'ogrs/calculateScore'
import { createOutputObject } from 'ogrs/createOutput'
import { addCalculatedInputParameters } from 'ogrs/common'
import { lookupValue, lookupNumericValue } from 'lib/utils'
import { ospRsrCalc } from 'ogrs/ospRsr'
import { TestCaseParameters, OutputParameters } from '../ogrs/types'
import { oasysDateAsPlainDate } from 'oasys'

export function calculateOgrs4(params: Ogrs4Params, resultAlias: string) {

    const calcResult: Ogrs4CalcResult = {
        details: {} as OutputParameters,
        arpResult: '',
        vrpResult: '',
        csrpResult: '',
    }

    cy.get<AppConfig>('@appConfig').then((appConfig) => {

        const calculatorParams: TestCaseParameters = {

            ASSESSMENT_DATE: oasysDateAsPlainDate(params.assessmentDate),
            STATIC_CALC: params.staticCalc,
            DOB: oasysDateAsPlainDate(params.dob),
            GENDER: lookupValue(params.gender, genderLookup),
            OFFENCE_CODE: params.offenceCode,
            TOTAL_SANCTIONS_COUNT: params.totalSanctionsCount,
            TOTAL_VIOLENT_SANCTIONS: params.totalViolentSanctions,
            CONTACT_ADULT_SANCTIONS: params.contactAdultSanctions,
            CONTACT_CHILD_SANCTIONS: params.contactChildSanctions,
            INDECENT_IMAGE_SANCTIONS: params.indecentImageSanctions,
            PARAPHILIA_SANCTIONS: params.paraphiliaSanctions,
            STRANGER_VICTIM: params.strangerVictim,
            AGE_AT_FIRST_SANCTION: params.ageAtFirstSanction,
            LAST_SANCTION_DATE: oasysDateAsPlainDate(params.lastSanctionDate),
            DATE_RECENT_SEXUAL_OFFENCE: oasysDateAsPlainDate(params.dateRecentSexualOffence),
            CURR_SEX_OFF_MOTIVATION: params.currSexOffMotivation,
            MOST_RECENT_OFFENCE: oasysDateAsPlainDate(params.mostRecentOffence),
            COMMUNITY_DATE: oasysDateAsPlainDate(params.communityDate),
            ONE_POINT_THIRTY: params.onePointThirty,
            TWO_POINT_TWO: ynTo10(params.twoPointTwo),
            THREE_POINT_FOUR: params.threePointFour,
            FOUR_POINT_TWO: ynTo10(params.fourPointTwo),
            SIX_POINT_FOUR: params.sixPointFour,
            SIX_POINT_SEVEN: params.sixPointSeven,
            SIX_POINT_EIGHT: lookupNumericValue(params.sixPointEight, q6_8Lookup),
            SEVEN_POINT_TWO: params.sevenPointTwo,
            DAILY_DRUG_USER: params.dailyDrugUser,
            AMPHETAMINES: params.amphetamines,
            BENZODIAZIPINES: params.benzodiazipines,
            CANNABIS: params.cannabis,
            CRACK_COCAINE: params.crackCocaine,
            ECSTASY: params.ecstasy,
            HALLUCINOGENS: params.hallucinogens,
            HEROIN: params.heroin,
            KETAMINE: params.ketamine,
            METHADONE: params.methadone,
            MISUSED_PRESCRIBED: params.misusedPrescribed,
            OTHER_DRUGS: params.otherDrugs,
            OTHER_OPIATE: params.otherOpiate,
            POWDER_COCAINE: params.powderCocaine,
            SOLVENTS: params.solvents,
            SPICE: params.spice,
            STEROIDS: params.steroids,
            EIGHT_POINT_EIGHT: params.eightPointEight,
            NINE_POINT_ONE: params.ninePointOne,
            NINE_POINT_TWO: params.ninePointTwo,
            ELEVEN_POINT_TWO: params.elevenPointTwo,
            ELEVEN_POINT_FOUR: params.elevenPointFour,
            TWELVE_POINT_ONE: params.twelvePointOne,
            OGRS4G_ALGO_VERSION: 1,
            OGRS4V_ALGO_VERSION: 1,
            OGP2_ALGO_VERSION: 1,
            OVP2_ALGO_VERSION: 1,
            OSP_ALGO_VERSION: 6,
            SNSV_ALGO_VERSION: 1,
            AGGRAVATED_BURGLARY: params.aggravatedBurglary,
            ARSON: params.arson,
            CRIMINAL_DAMAGE_LIFE: params.criminalDamageLife,
            FIREARMS: params.firearms,
            GBH: params.gbh,
            HOMICIDE: params.homicide,
            KIDNAP: params.kidnap,
            ROBBERY: params.robbery,
            WEAPONS_NOT_FIREARMS: params.weaponsNotFirearms,
            CUSTODY_IND: params.custodyInd,
        }

        addCalculatedInputParameters(calculatorParams, appConfig.offences)
        const result = createOutputObject()

        cy.log(JSON.stringify(calculatorParams))
        calculate('serious_violence_extended', calculatorParams, result)
        calculate('general_extended', calculatorParams, result)
        calculate('violence_extended', calculatorParams, result)

        // Attempt brief versions for SNSV, OGRS4G, OGRS4V if no results from the extended ones.
        calculate('serious_violence_brief', calculatorParams, result, result.SNSV_CALCULATED_DYNAMIC == 'Y')
        calculate('general_brief', calculatorParams, result, result.OGP2_CALCULATED == 'Y')
        calculate('violence_brief', calculatorParams, result, result.OVP2_CALCULATED == 'Y')

        // OSP and RSR
        ospRsrCalc(calculatorParams, result)

        calcResult.details = result
        const arp = result.OGP2_CALCULATED == 'Y' ? result.OGP2_PERCENTAGE : result.OGRS4G_PERCENTAGE
        const arpBand = result.OGP2_CALCULATED == 'Y' ? result.OGP2_BAND : result.OGRS4G_BAND
        const arpType = result.OGP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.OGRS4G_CALCULATED ? 'STATIC' : ''
        calcResult.arpResult = `${arpType}  ${arp}%   ${arpBand}`
    }).then(() => {
        cy.wrap(calcResult).as(resultAlias)
    })
}

const genderLookup = {
    'Not specified': 'N',
    'Male': 'M',
    'Female': 'F',
    'Other': 'O',
    'Not known': 'U',
}

const ynLookup = {
    YES: 'Y',
    NO: 'N',
}

function ynTo10(param: string): number {

    return param == 'Y' ? 1 : param == 'N' ? 0 : null
}

const q6_8Lookup = {
    'In a relationship, living together': 1,
    'In a relationship, not living together': 2,
    'Not in a relationship': 3,
}