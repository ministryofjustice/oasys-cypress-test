import { calculate } from 'ogrs/calculateScore'
import { createOutputObject } from 'ogrs/createOutput'
import { addCalculatedInputParameters, da, dailyDrugUser, getDrugsUsage, getDrugUsed, q141, q22, q88 } from 'ogrs/common'
import { lookupString, lookupInteger, problemsAnswerToNumeric } from 'lib/utils'
import { OasysDateTime } from './dateTime'
import { ospRsrCalc } from 'ogrs/ospRsr'
import { TestCaseParameters, OutputParameters } from '../ogrs/types'
import { OgrsRegressionTestAssessment } from '../../cypress/support/ogrs/getTestData/getOneAssessment'

export function calculateOgrs4(params: Ogrs4Params, resultAlias: string) {

    let calcResult: Ogrs4CalcResult = null

    cy.get<AppConfig>('@appConfig').then((appConfig) => {

        const calculatorParams: TestCaseParameters = {

            ASSESSMENT_DATE: OasysDateTime.oasysDateAsPlainDate(params.assessmentDate ?? {}),
            STATIC_CALC: params.staticCalc ? 'Y' : 'N',
            DOB: OasysDateTime.oasysDateAsPlainDate(params.dob),
            GENDER: lookupString(params.gender, genderLookup),
            OFFENCE_CODE: params.offenceCode,
            TOTAL_SANCTIONS_COUNT: params.totalSanctionsCount,
            TOTAL_VIOLENT_SANCTIONS: params.totalViolentSanctions,
            CONTACT_ADULT_SANCTIONS: params.contactAdultSanctions,
            CONTACT_CHILD_SANCTIONS: params.contactChildSanctions,
            INDECENT_IMAGE_SANCTIONS: params.indecentImageSanctions,
            PARAPHILIA_SANCTIONS: params.paraphiliaSanctions,
            STRANGER_VICTIM: yesNoToYN(params.strangerVictim),
            AGE_AT_FIRST_SANCTION: params.ageAtFirstSanction,
            LAST_SANCTION_DATE: OasysDateTime.oasysDateAsPlainDate(params.lastSanctionDate),
            DATE_RECENT_SEXUAL_OFFENCE: OasysDateTime.oasysDateAsPlainDate(params.dateRecentSexualOffence),
            CURR_SEX_OFF_MOTIVATION: yesNoToYN(params.currSexOffMotivation),
            MOST_RECENT_OFFENCE: OasysDateTime.oasysDateAsPlainDate(params.mostRecentOffence),
            COMMUNITY_DATE: OasysDateTime.oasysDateAsPlainDate(params.communityDate),
            ONE_POINT_THIRTY: yesNoToYN(params.onePointThirty),
            TWO_POINT_TWO: yesNoTo1_0(params.twoPointTwo),
            THREE_POINT_FOUR: problemsAnswerToNumeric(params.threePointFour),
            FOUR_POINT_TWO: yesNoTo1_0(params.fourPointTwo),
            SIX_POINT_FOUR: problemsAnswerToNumeric(params.sixPointFour),
            SIX_POINT_SEVEN: yesNoTo1_0(params.sixPointSeven),
            SIX_POINT_EIGHT: lookupInteger(params.sixPointEight, q6_8Lookup),
            SEVEN_POINT_TWO: problemsAnswerToNumeric(params.sevenPointTwo),
            DAILY_DRUG_USER: yesNoToYN(params.dailyDrugUser),
            AMPHETAMINES: yesNoToYN(params.amphetamines),
            BENZODIAZIPINES: yesNoToYN(params.benzodiazipines),
            CANNABIS: yesNoToYN(params.cannabis),
            CRACK_COCAINE: yesNoToYN(params.crackCocaine),
            ECSTASY: yesNoToYN(params.ecstasy),
            HALLUCINOGENS: yesNoToYN(params.hallucinogens),
            HEROIN: yesNoToYN(params.heroin),
            KETAMINE: yesNoToYN(params.ketamine),
            METHADONE: yesNoToYN(params.methadone),
            MISUSED_PRESCRIBED: yesNoToYN(params.misusedPrescribed),
            OTHER_DRUGS: yesNoToYN(params.otherDrugs),
            OTHER_OPIATE: yesNoToYN(params.otherOpiate),
            POWDER_COCAINE: yesNoToYN(params.powderCocaine),
            SOLVENTS: yesNoToYN(params.solvents),
            SPICE: yesNoToYN(params.spice),
            STEROIDS: yesNoToYN(params.steroids),
            EIGHT_POINT_EIGHT: problemsAnswerToNumeric(params.eightPointEight),
            NINE_POINT_ONE: problemsAnswerToNumeric(params.ninePointOne),
            NINE_POINT_TWO: problemsAnswerToNumeric(params.ninePointTwo),
            ELEVEN_POINT_TWO: problemsAnswerToNumeric(params.elevenPointTwo),
            ELEVEN_POINT_FOUR: problemsAnswerToNumeric(params.elevenPointFour),
            TWELVE_POINT_ONE: problemsAnswerToNumeric(params.twelvePointOne),
            OGRS4G_ALGO_VERSION: 1,
            OGRS4V_ALGO_VERSION: 1,
            OGP2_ALGO_VERSION: 1,
            OVP2_ALGO_VERSION: 1,
            OSP_ALGO_VERSION: 6,
            SNSV_ALGO_VERSION: 1,
            AGGRAVATED_BURGLARY: yesNoTo1_0(params.aggravatedBurglary),
            ARSON: yesNoTo1_0(params.arson),
            CRIMINAL_DAMAGE_LIFE: yesNoTo1_0(params.criminalDamageLife),
            FIREARMS: yesNoTo1_0(params.firearms),
            GBH: yesNoTo1_0(params.gbh),
            HOMICIDE: yesNoTo1_0(params.homicide),
            KIDNAP: yesNoTo1_0(params.kidnap),
            ROBBERY: yesNoTo1_0(params.robbery),
            WEAPONS_NOT_FIREARMS: yesNoTo1_0(params.weaponsNotFirearms),
            CUSTODY_IND: params.custodyInd == null ? 'N' : yesNoToYN(params.custodyInd),
        }

        calcResult = getResult(calculatorParams, appConfig)

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

const genderNumberLookup = {
    '0': 'N',
    '1': 'M',
    '2': 'F',
    '3': 'O',
    '9': 'U',
}

const ynLookup = {
    YES: 'Y',
    NO: 'N',
}

export function checkOgrs4Calcs(assessmentPk: number) {

    cy.task('getOgrsRegressionTestAssessment', assessmentPk).then((assessment: OgrsRegressionTestAssessment) => {

        let staticCalc = 'N'
        if (assessment.type == 'LAYER_1' && assessment.version == 2) {  // RoSHA - set static flag according to 1.39 (offender interview)
            if (lookupString('1.39', assessment.qaData) != 'YES') {
                staticCalc = 'Y'
            }
        }

        cy.get<AppConfig>('@appConfig').then((appConfig) => {

            const drugs = getDrugsUsage(assessment.qaData)
            const q81 = lookupString('8.1', assessment.qaData)

            const calculatorParams: TestCaseParameters = {

                ASSESSMENT_DATE: OasysDateTime.testStartDate,
                STATIC_CALC: staticCalc,
                DOB: OasysDateTime.stringToDate(assessment.dob),
                GENDER: lookupString(assessment.gender, genderNumberLookup),
                OFFENCE_CODE: assessment.offence,
                TOTAL_SANCTIONS_COUNT: lookupInteger('1.32', assessment.qaData),
                TOTAL_VIOLENT_SANCTIONS: lookupInteger('1.40', assessment.qaData),
                CONTACT_ADULT_SANCTIONS: lookupInteger('1.34', assessment.qaData),
                CONTACT_CHILD_SANCTIONS: lookupInteger('1.45', assessment.qaData),
                INDECENT_IMAGE_SANCTIONS: lookupInteger('1.46', assessment.qaData),
                PARAPHILIA_SANCTIONS: lookupInteger('1.37', assessment.qaData),
                STRANGER_VICTIM: lookupString('1.44', assessment.qaData, ynLookup),
                AGE_AT_FIRST_SANCTION: lookupInteger('1.8', assessment.qaData),
                LAST_SANCTION_DATE: OasysDateTime.stringToDate(lookupString('1.29', assessment.qaData)),
                DATE_RECENT_SEXUAL_OFFENCE: OasysDateTime.stringToDate(lookupString('1.33', assessment.qaData)),
                CURR_SEX_OFF_MOTIVATION: q141(lookupString('1.30', assessment.qaData), lookupString('1.40', assessment.qaData), assessment.offence, appConfig.offences),
                MOST_RECENT_OFFENCE: OasysDateTime.stringToDate(lookupString('1.43', assessment.qaData)),
                COMMUNITY_DATE: OasysDateTime.stringToDate(lookupString('1.38', assessment.qaData)),
                ONE_POINT_THIRTY: lookupString('1.30', assessment.qaData, ynLookup),
                TWO_POINT_TWO: q22(lookupString('2.2_V2_WEAPON', assessment.qaData)),
                THREE_POINT_FOUR: lookupInteger('3.4', assessment.qaData),
                FOUR_POINT_TWO: lookupInteger('4.2', assessment.qaData, yesNo1_0Lookup),
                SIX_POINT_FOUR: lookupInteger('6.4', assessment.qaData),
                SIX_POINT_SEVEN: da(lookupString('6.7da', assessment.qaData), lookupString('6.7.2.1da', assessment.qaData)),
                SIX_POINT_EIGHT: lookupInteger('6.8', assessment.qaData),
                SEVEN_POINT_TWO: lookupInteger('7.2', assessment.qaData),
                DAILY_DRUG_USER: dailyDrugUser(q81, drugs),
                AMPHETAMINES: getDrugUsed('AMPHETAMINES', drugs),
                BENZODIAZIPINES: getDrugUsed('BENZODIAZIPINES', drugs),
                CANNABIS: getDrugUsed('CANNABIS', drugs),
                CRACK_COCAINE: getDrugUsed('CRACK_COCAINE', drugs),
                ECSTASY: getDrugUsed('ECSTASY', drugs),
                HALLUCINOGENS: getDrugUsed('HALLUCINOGENS', drugs),
                HEROIN: getDrugUsed('HEROIN', drugs),
                KETAMINE: getDrugUsed('KETAMINE', drugs),
                METHADONE: getDrugUsed('METHADONE', drugs),
                MISUSED_PRESCRIBED: getDrugUsed('MISUSED_PRESCRIBED', drugs),
                OTHER_DRUGS: getDrugUsed('OTHER_DRUGS', drugs),
                OTHER_OPIATE: getDrugUsed('OTHER_OPIATE', drugs),
                POWDER_COCAINE: getDrugUsed('POWDER_COCAINE', drugs),
                SOLVENTS: getDrugUsed('SOLVENTS', drugs),
                SPICE: getDrugUsed('SPICE', drugs),
                STEROIDS: getDrugUsed('STEROIDS', drugs),
                EIGHT_POINT_EIGHT: q88(q81, lookupInteger('8.8', assessment.qaData)),
                NINE_POINT_ONE: lookupInteger('9.1', assessment.qaData),
                NINE_POINT_TWO: lookupInteger('9.2', assessment.qaData),
                ELEVEN_POINT_TWO: lookupInteger('11.2', assessment.qaData),
                ELEVEN_POINT_FOUR: lookupInteger('11.4', assessment.qaData),
                TWELVE_POINT_ONE: lookupInteger('12.1', assessment.qaData),
                OGRS4G_ALGO_VERSION: 1,
                OGRS4V_ALGO_VERSION: 1,
                OGP2_ALGO_VERSION: 1,
                OVP2_ALGO_VERSION: 1,
                OSP_ALGO_VERSION: 6,
                SNSV_ALGO_VERSION: 1,
                AGGRAVATED_BURGLARY: lookupInteger('R1.2.6.2_V2', assessment.qaData, yesNo1_0Lookup),
                ARSON: lookupInteger('R1.2.7.2_V2', assessment.qaData, yesNo1_0Lookup),
                CRIMINAL_DAMAGE_LIFE: lookupInteger('R1.2.8.2_V2', assessment.qaData, yesNo1_0Lookup),
                FIREARMS: lookupInteger('R1.2.10.2_V2', assessment.qaData, yesNo1_0Lookup),
                GBH: lookupInteger('R1.2.2.2_V2', assessment.qaData, yesNo1_0Lookup),
                HOMICIDE: lookupInteger('R1.2.1.2_V2', assessment.qaData, yesNo1_0Lookup),
                KIDNAP: lookupInteger('R1.2.9.2_V2', assessment.qaData, yesNo1_0Lookup),
                ROBBERY: lookupInteger('R1.2.12.2_V2', assessment.qaData, yesNo1_0Lookup),
                WEAPONS_NOT_FIREARMS: lookupInteger('R1.2.13.2_V2', assessment.qaData, yesNo1_0Lookup),
                CUSTODY_IND: assessment.prisonInd == 'C' ? 'Y' : 'N',
            }
            const calcResult = getResult(calculatorParams, appConfig)

            cy.groupedLogStart('Checking OGRS4 calculations')
            let failed = checkResult('ARP static score', calcResult.details.OGRS4G_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4gYr2)
            failed = checkResult('ARP static band', calcResult.details.OGRS4G_BAND?.substring(0, 1) ?? null, assessment.ogrs4gBand) || failed
            failed = checkResult('ARP static calculated', calcResult.details.OGRS4G_CALCULATED, assessment.ogrs4gCalculated) || failed
            failed = checkResult('ARP dynamic score', calcResult.details.OGP2_PERCENTAGE?.toNumber() ?? null, assessment.ogp2Yr2) || failed
            failed = checkResult('ARP dynamic band', calcResult.details.OGP2_BAND?.substring(0, 1) ?? null, assessment.ogp2Band) || failed
            failed = checkResult('ARP dynamic calculated', calcResult.details.OGP2_CALCULATED, assessment.ogp2Calculated) || failed
            failed = checkResult('VRP static score', calcResult.details.OGRS4V_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4vYr2) || failed
            failed = checkResult('VRP static band', calcResult.details.OGRS4V_BAND?.substring(0, 1) ?? null, assessment.ogrs4vBand) || failed
            failed = checkResult('VRP static calculated', calcResult.details.OGRS4V_CALCULATED, assessment.ogrs4vCalculated) || failed
            failed = checkResult('VRP dynamic score', calcResult.details.OVP2_PERCENTAGE?.toNumber() ?? null, assessment.ovp2Yr2) || failed
            failed = checkResult('VRP dynamic band', calcResult.details.OVP2_BAND?.substring(0, 1) ?? null, assessment.ovp2Band) || failed
            failed = checkResult('VRP dynamic calculated', calcResult.details.OVP2_CALCULATED, assessment.ovp2Calculated) || failed
            failed = checkResult('SVRP static score', calcResult.details.SNSV_PERCENTAGE_STATIC?.toNumber() ?? null, assessment.snsvStaticYr2) || failed
            failed = checkResult('SVRP static band', calcResult.details.SNSV_BAND_STATIC?.substring(0, 1) ?? null, assessment.snsvStaticYr2Band) || failed
            failed = checkResult('SVRP static calculated', calcResult.details.SNSV_CALCULATED_STATIC, assessment.snsvStaticCalculated) || failed
            failed = checkResult('SVRP dynamic score', calcResult.details.SNSV_PERCENTAGE_DYNAMIC?.toNumber() ?? null, assessment.snsvDynamicYr2) || failed
            failed = checkResult('SVRP dynamic band', calcResult.details.SNSV_BAND_DYNAMIC?.substring(0, 1) ?? null, assessment.snsvDynamicYr2Band) || failed
            failed = checkResult('SVRP dynamic calculated', calcResult.details.SNSV_CALCULATED_DYNAMIC, assessment.snsvDynamicCalculated) || failed

            cy.groupedLogEnd().then(() => {
                if (failed) {
                    cy.log(JSON.stringify(calculatorParams))
                    cy.log(JSON.stringify(calcResult))
                }
                expect(failed).to.be.false
            })

        })

    })

}

function getResult(calculatorParams: TestCaseParameters, appConfig: AppConfig): Ogrs4CalcResult {

    const calcResult: Ogrs4CalcResult = {
        details: createOutputObject(),
        arpText: '',
        vrpText: '',
        svrpText: '',
        dcSrpBand: '',
        iicSrpBand: '',
        csrpType: '',
        csrpBand: '',
        csrpScore: '',
    }

    addCalculatedInputParameters(calculatorParams, appConfig.offences)
    const result = createOutputObject()

    calculate('serious_violence_extended', calculatorParams, result)
    calculate('general_extended', calculatorParams, result)
    calculate('violence_extended', calculatorParams, result)

    // Attempt brief versions for SNSV, OGRS4G, OGRS4V if no results from the extended ones.
    calculate('serious_violence_brief', calculatorParams, result, result.SNSV_CALCULATED_DYNAMIC == 'Y')
    calculate('general_brief', calculatorParams, result, result.OGP2_CALCULATED == 'Y')
    calculate('violence_brief', calculatorParams, result, result.OVP2_CALCULATED == 'Y')

    // OSP and RSR
    ospRsrCalc(calculatorParams, result)

    // Compile results
    calcResult.details = result
    const arp = result.OGP2_CALCULATED == 'Y' ? result.OGP2_PERCENTAGE : result.OGRS4G_PERCENTAGE
    const arpBand = result.OGP2_CALCULATED == 'Y' ? result.OGP2_BAND : result.OGRS4G_BAND
    const arpType = result.OGP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.OGRS4G_CALCULATED ? 'STATIC' : ''
    calcResult.arpText = `${arpType}  ${arp}%   ${arpBand}`

    const vrp = result.OVP2_CALCULATED == 'Y' ? result.OVP2_PERCENTAGE : result.OGRS4V_PERCENTAGE
    const vrpBand = result.OVP2_CALCULATED == 'Y' ? result.OVP2_BAND : result.OGRS4V_BAND
    const vrpType = result.OVP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.OGRS4V_CALCULATED ? 'STATIC' : ''
    calcResult.vrpText = `${vrpType}  ${vrp}%   ${vrpBand}`

    const svrp = result.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.SNSV_PERCENTAGE_DYNAMIC : result.SNSV_PERCENTAGE_STATIC
    const svrpBand = result.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.SNSV_BAND_DYNAMIC : result.SNSV_BAND_STATIC
    const svrpType = result.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'DYNAMIC' : result.SNSV_CALCULATED_STATIC ? 'STATIC' : ''
    calcResult.svrpText = `${svrpType}  ${svrp}%   ${svrpBand}`

    calcResult.dcSrpBand = result.OSP_DC_BAND?.toUpperCase()
    calcResult.iicSrpBand = result.OSP_IIC_BAND?.toUpperCase()

    calcResult.csrpBand = result.RSR_BAND?.toUpperCase()
    calcResult.csrpType = result.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : result.RSR_CALCULATED == 'Y' ? 'STATIC' : ''
    calcResult.csrpScore = ` ${result.RSR_PERCENTAGE}`

    return calcResult
}

function checkResult(description: string, expectedValue: string | number, actualValue: string | number): boolean {

    const failed = expectedValue != actualValue
    if (failed) {
        cy.groupedLog(`${description}: expected ${expectedValue}, got ${actualValue}. FAILED`)
    }
    return failed
}

function yesNoTo1_0(param: YesNoAnswer): number {

    return param == 'Yes' ? 1 : param == 'No' ? 0 : null
}

function yesNoToYN(param: YesNoAnswer): string {

    return param == 'Yes' ? 'Y' : param == 'No' ? 'N' : null
}

const q6_8Lookup = {
    'In a relationship, living together': 1,
    'In a relationship, not living together': 2,
    'Not in a relationship': 3,
}

const yesNo1_0Lookup = {
    'YES': 1,
    'NO': 0,
}

export type Ogrs4CalcResult = {

    details: OutputParameters,
    arpText: string,
    vrpText: string,
    svrpText: string,
    dcSrpBand: string,
    iicSrpBand: string,
    csrpType: string,
    csrpBand: string,
    csrpScore: string,
}
