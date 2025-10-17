import * as dayjs from 'dayjs'

import { OgrsTestParameters, OgrsTestScriptResult, OutputParameters, TestCaseParameters } from '../../cypress/support/ogrs/types'

describe('OGRS calculator test', () => {

    const tolerance = '1E-37'
    const precision = 40
    const timeout = 600000

    const dbTestParams: OgrsTestParameters = {
        testType: 'db',
        dbDetails: {
            type: 'assessment',
            whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`,
            count: 5,
        },
        tolerance: tolerance,
        precision: precision,
        reportMode: 'minimal',
    }

    const csvTestParams: OgrsTestParameters = {
        testType: 'csv',
        csvDetails: {
            dataFile: '',
        },
        tolerance: tolerance,
        precision: precision,
        reportMode: 'minimal',
    }

    const outputFile = 'output'
    let outputData = ''

    let cases = 0
    let failures = 0
    let summary: { title: string, cases: number, failures: number, duration: number }[] = []

    let start = dayjs()
    if (outputFile) {
        outputData = createOutputHeader()
    }

    it(`Layer 3 v1 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`
        runTest(dbTestParams)
    })

    it(`Layer 3 v1 not complete (any other status)`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`
        runTest(dbTestParams)
    })

    it(`Layer 3 v2 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 2 and assessment_status_elm = 'COMPLETE'`
        runTest(dbTestParams)
    })

    it(`Layer 1 v2 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
            runTest(dbTestParams)
    })

    it(`Standalone RSR complete`, () => {

        dbTestParams.dbDetails.type = 'rsr'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and rsr_status = 'COMPLETE'`
        runTest(dbTestParams)
    })

    it('Example set of 20', () => {

        csvTestParams.csvDetails.dataFile = 'test1Input'
        runTest(csvTestParams)
    })

    it('Example set of 20 (with some missing questions)', () => {

        csvTestParams.csvDetails.dataFile = 'test1inputWithMissingFields'
        runTest(csvTestParams)
    })

    function runTest(params: OgrsTestParameters) {
        cy.task('ogrsAssessmentCalcTest', params, { timeout: timeout }).then((result: OgrsTestScriptResult) => {

            report(params, result)
            cases = result.cases
            failures = result.failures

        }).then(() => {
            const now = dayjs()
            summary.push({ title: Cypress.currentTest.title, cases: cases, failures: failures, duration: now.diff(start) })
            start = now  // set for the next test

            if (failures > 0) {
                throw new Error(`${failures} failed out of ${cases}`)
            }
        })
    }

    it('Summary', () => {

        const totalCases = summary.reduce((n, { cases }) => n + cases, 0)
        const totalFailures = summary.reduce((n, { failures }) => n + failures, 0)
        const totalDuration = summary.reduce((n, { duration }) => n + duration, 0)
        cy.groupedLogStart(`TOTAL ${totalCases} tests, ${totalFailures} failures.  Duration: ${(totalDuration / 1000).toFixed(0)}s`)
        cy.groupedLog('')

        summary.forEach((test) => cy.groupedLog(`${test.title}: ${test.cases} tests, ${test.failures} failure(s).  Duration: ${test.duration}ms`))
        cy.groupedLogEnd()

        if (outputFile) {
            cy.writeFile(`./cypress/downloads/${outputFile}.csv`, outputData.slice(0, -1), { encoding: null })
        }
    })

    function report(testParams: OgrsTestParameters, result: OgrsTestScriptResult) {

        if (testParams.testType == 'csv') {
            cy.groupedLogStart(`Test data file: ${testParams.csvDetails.dataFile}, expected results file: ${testParams.csvDetails.expectedResultsFile}, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)
        } else {
            cy.groupedLogStart(`Test data from OASys, tolerance: ${testParams.tolerance}, precisison: ${testParams.precision}`)
        }
        cy.groupedLog(`Cases: ${result.cases}, failures: ${result.failures}.  ${result.failures > 0 ? 'FAILED' : 'PASSED'}`)

        result.testCaseResults.forEach((testCase) => {

            testCase.logText.forEach((log) => {
                cy.groupedLog(log)
            })
            if (outputFile) {
                outputData = `${outputData}${createOutputCsvLine(testCase.identifier, testCase.inputParams, testCase.outputParams)}\n`
            }
        })
        cy.groupedLogEnd()

    }

    function createOutputHeader(): string {

        return `Ref,STATIC_CALC,DOB,GENDER,OFFENCE_CODE,TOTAL_SANCTIONS_COUNT,TOTAL_VIOLENT_SANCTIONS,CONTACT_ADULT_SANCTIONS,CONTACT_CHILD_SANCTIONS,INDECENT_IMAGE_SANCTIONS,PARAPHILIA_SANCTIONS,STRANGER_VICTIM,AGE_AT_FIRST_SANCTION,LAST_SANCTION_DATE,DATE_RECENT_SEXUAL_OFFENCE: dayj,CURR_SEX_OFF_MOTIVATION,MOST_RECENT_OFFENCE: dayj,COMMUNITY_DATE: dayj,ONE_POINT_THIRTY,TWO_POINT_TWO,THREE_POINT_FOUR,FOUR_POINT_TWO,SIX_POINT_FOUR,SIX_POINT_SEVEN,SIX_POINT_EIGHT,SEVEN_POINT_TWO,DAILY_DRUG_USER,AMPHETAMINES,BENZODIAZIPINES,CANNABIS,CRACK_COCAINE,ECSTASY,HALLUCINOGENS,HEROIN,KETAMINE,METHADONE,MISUSED_PRESCRIBED,OTHER_DRUGS,OTHER_OPIATE,POWDER_COCAINE,SOLVENTS,SPICE,STEROIDS,EIGHT_POINT_EIGHT,NINE_POINT_ONE,NINE_POINT_TWO,ELEVEN_POINT_TWO,ELEVEN_POINT_FOUR,TWELVE_POINT_ONE,OGRS4G_ALGO_VERSION,OGRS4V_ALGO_VERSION,OGP2_ALGO_VERSION,OVP2_ALGO_VERSION,OSP_ALGO_VERSION,SNSV_ALGO_VERSION,AGGRAVATED_BURGLARY,ARSON,CRIMINAL_DAMAGE_LIFE,FIREARMS,GBH,HOMICIDE,KIDNAP,ROBBERY,WEAPONS_NOT_FIREARMS,CUSTODY_IND,age,ageAtLastSanction,ageAtLastSanctionSexual,yearsBetweenFirstTwoSanctions,ofm,offenceCat,firstSanction,secondSanction,neverSanctionedViolence,onceViolent,male,female,out5Years,offenceInLast5Years,sexualOffenceInLast5Years,OGRS4G_CALCULATED,OGRS4G_YEAR_TWO,OGRS4G_AAEAD,OGRS4G_FEMALE,OGRS4G_OFFENCE,OGRS4G_FIRST_SANCTION,OGRS4G_SECOND_SANCTION,OGRS4G_TOTAL_SANCTIONS,OGRS4G_SECOND_SANCTION_GAP,OGRS4G_OFM,OGRS4G_COPASG,OGRS4G_COPASG_SQUARED,OGRS4G_SCORE,OGRS4G_PERCENTAGE,OGRS4G_BAND,OGRS4G_MISSING_QUESTIONS,OGRS4G_MISSING_COUNT,OGRS4V_CALCULATED,OGRS4V_YEAR_TWO,OGRS4V_AAEAD,OGRS4V_FEMALE,OGRS4V_OFFENCE,OGRS4V_FIRST_SANCTION,OGRS4V_SECOND_SANCTION,OGRS4V_TOTAL_SANCTIONS,OGRS4V_SECOND_SANCTION_GAP,OGRS4V_OFM,OGRS4V_COPASV,OGRS4V_NEVER_VIOLENT,OGRS4V_ONCE_VIOLENT,OGRS4V_TOT_VIOLENT_SANCTIONS,OGRS4V_COPAS_VIOLENT,OGRS4V_SCORE,OGRS4V_PERCENTAGE,OGRS4V_BAND,OGRS4V_MISSING_QUESTIONS,OGRS4V_MISSING_COUNT,SNSV_CALCULATED_STATIC,SNSV_YEAR_TWO_STATIC,SNSV_AAEAD_STATIC,SNSV_FEMALE_STATIC,SNSV_OFFENCE_STATIC,SNSV_FIRST_SANCTION_STATIC,SNSV_SECOND_SANCTION_STATIC,SNSV_TOTAL_SANCTIONS_STATIC,SNSV_SECOND_SANC_GAP_STATIC,SNSV_OFM_STATIC,SNSV_COPASV_STATIC,SNSV_NEVER_VIOLENT_STATIC,SNSV_ONCE_VIOLENT_STATIC,SNSV_TOT_VIOLENT_SANC_STATIC,SNSV_COPAS_VIOLENT_STATIC,SNSV_SCORE_STATIC,SNSV_PERCENTAGE_STATIC,SNSV_BAND_STATIC,SNSV_MISSING_QUESTIONS_STATIC,SNSV_MISSING_COUNT_STATIC,OGP2_CALCULATED,OGP2_YEAR_TWO,OGP2_AAEAD,OGP2_FEMALE,OGP2_OFFENCE,OGP2_FIRST_SANCTION,OGP2_SECOND_SANCTION,OGP2_TOTAL_SANCTIONS,OGP2_SECOND_SANCTION_GAP,OGP2_OFM,OGP2_COPASG,OGP2_COPASG_SQUARED,OGP2_SUITABLE_ACC,OGP2_UNEMPLOYED,OGP2_LIVE_IN_RELATIONSHIP,OGP2_RELATIONSHIP,OGP2_MULTIPLIC_RELATIONSHIP,OGP2_DV,OGP2_REGULAR_ACTIVITIES,OGP2_DAILY_DRUG_USER,OGP2_DRUG_MOTIVATION,OGP2_CHRONIC_DRINKER,OGP2_BINGE_DRINKER,OGP2_IMPULSIVE,OGP2_CRIMINAL_ATTITUDE,OGP2_HEROIN,OGP2_METHADONE,OGP2_OTHER_OPIATE,OGP2_CRACK,OGP2_COCAINE,OGP2_MISUSE_PRESCRIBED,OGP2_BENZOS,OGP2_AMPHETAMINES,OGP2_ECSTASY,OGP2_CANNABIS,OGP2_STEROIDS,OGP2_OTHER_DRUGS,OGP2_TOTAL_SCORE,OGP2_PERCENTAGE,OGP2_BAND,OGP2_MISSING_QUESTIONS,OGP2_MISSING_COUNT,OVP2_CALCULATED,OVP2_YEAR_TWO,OVP2_AAEAD,OVP2_FEMALE,OVP2_OFFENCE,OVP2_FIRST_SANCTION,OVP2_SECOND_SANCTION,OVP2_TOTAL_SANCTIONS,OVP2_SECOND_SANCTION_GAP,OVP2_OFM,OVP2_COPASV,OVP2_NEVER_VIOLENT,OVP2_ONCE_VIOLENT,OVP2_TOTAL_VIOLENT_SANCTIONS,OVP2_COPAS_VIOLENT,OVP2_SUITABLE_ACC,OVP2_UNEMPLOYED,OVP2_RELATIONSHIP,OVP2_LIVE_IN_RELATIONSHIP,OVP2_MULTIPLIC_RELATIONSHIP,OVP2_DV,OVP2_REGULAR_ACTIVITIES,OVP2_DRUG_MOTIVATION,OVP2_CHRONIC_DRINKER,OVP2_BINGE_DRINKER,OVP2_IMPULSIVE,OVP2_TEMPER,OVP2_CRIMINAL_ATTITUDE,OVP2_HEROIN,OVP2_CRACK,OVP2_COCAINE,OVP2_MISUSE_PRESCRIBED,OVP2_BENZOS,OVP2_AMPHETAMINES,OVP2_ECSTASY,OVP2_CANNABIS,OVP2_STEROIDS,OVP2_TOTAL_SCORE,OVP2_PERCENTAGE,OVP2_BAND,OVP2_MISSING_QUESTIONS,OVP2_MISSING_COUNT,SNSV_CALCULATED_DYNAMIC,SNSV_YEAR_TWO_DYNAMIC,SNSV_AAEAD_DYNAMIC,SNSV_FEMALE_DYNAMIC,SNSV_OFFENCE_DYNAMIC,SNSV_FIRST_SANCTION_DYNAMIC,SNSV_SECOND_SANCTION_DYNAMIC,SNSV_TOTAL_SANCTIONS_DYNAMIC,SNSV_SECOND_SANC_GAP_DYNAMIC,SNSV_OFM_DYNAMIC,SNSV_COPASV_DYNAMIC,SNSV_NEVER_VIOLENT_DYNAMIC,SNSV_ONCE_VIOLENT_DYNAMIC,SNSV_TOT_VIOLENT_SANC_DYNAMIC,SNSV_COPAS_VIOLENT_DYNAMIC,SNSV_WEAPON_DYNAMIC,SNSV_SUITABLE_ACC_DYNAMIC,SNSV_UNEMPLOYED_DYNAMIC,SNSV_RELATION_QUALITY_DYNAMIC,SNSV_DV_DYNAMIC,SNSV_CHRONIC_DRINKER_DYNAMIC,SNSV_BINGE_DRINKER_DYNAMIC,SNSV_IMPULSIVE_DYNAMIC,SNSV_TEMPER_DYNAMIC,SNSV_CRIM_ATTITUDE_DYNAMIC,SNSV_HOMICIDE_DYNAMIC,SNSV_GBH_DYNAMIC,SNSV_KIDNAP_DYNAMIC,SNSV_FIREARMS_DYNAMIC,SNSV_ROBBERY_DYNAMIC,SNSV_AGG_BURGLARY_DYNAMIC,SNSV_WEAPONS_NOT_GUNS_DYNAMIC,SNSV_CRIM_DAMAGE_LIFE_DYNAMIC,SNSV_ARSON_DYNAMIC,SNSV_SCORE_DYNAMIC,SNSV_PERCENTAGE_DYNAMIC,SNSV_BAND_DYNAMIC,SNSV_MISSING_QUESTIONS_DYNAMIC,SNSV_MISSING_COUNT_DYNAMIC,OSP_DC_CALCULATED,OSP_DC_SCORE,OSP_DC_PERCENTAGE,OSP_DC_BAND,OSP_DC_RISK_REDUCTION,OSP_DC_MISSING_QUESTIONS,OSP_DC_MISSING_COUNT,OSP_IIC_CALCULATED,OSP_IIC_PERCENTAGE,OSP_IIC_BAND,OSP_IIC_MISSING_QUESTIONS,OSP_IIC_MISSING_COUNT,RSR_CALCULATED,RSR_DYNAMIC,RSR_PERCENTAGE,RSR_BAND,RSR_MISSING_QUESTIONS,RSR_MISSING_COUNT\n`
    }

    function createOutputCsvLine(identifier: string, inputParams: TestCaseParameters, outputParams: OutputParameters): string {

        if (inputParams && outputParams) {
            let line = `${identifier},`
            Object.keys(inputParams).forEach((key) => {
                const value = inputParams[key]
                line = `${line}${value ?? ''},`
            })
            Object.keys(outputParams).forEach((key) => {
                let value = outputParams[key]
                if (value) {
                    value = value.toString().replaceAll('\n', '').replaceAll(',', '')
                }
                line = `${line}${value ?? ''},`
            })
            return line.slice(0, -1) // remove last comma}
        }
        return ''
    }
})