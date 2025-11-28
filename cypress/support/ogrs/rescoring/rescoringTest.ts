import * as fs from 'fs-extra'


import { OutputParameters, RescoringResult, RescoringTestParameters, TestCaseParameters } from '../types'
import { getOgrsResult } from '../../oasysDb'
import { Dayjs } from 'dayjs'
import { getOffenderData } from './getOffenderData'
import { createAssessmentTestCase } from './createAssessmentTestCase'
import { offences } from '../data/offences'
import * as db from '../../oasysDb'
import { loadOracleOutputValues } from '../loadTestData'

const dataFilePath = './cypress/support/ogrs/data/'
export const dateFormat = 'DD-MM-YYYY'

export async function rescoringTest(testParams: RescoringTestParameters): Promise<RescoringResult[]> {

    const results: RescoringResult[] = []

    // Load offence codes from OASys
    const offenceCodeData = await db.selectData('select offence_group_code || sub_code, rsr_category_desc from eor.ct_offence order by 1')
    if (offenceCodeData.error != null) {
        throw new Error(offenceCodeData.error)
    }
    (offenceCodeData.data as string[][]).forEach(offence => {
        offences[offence[0]] = offence[1]
    })

    // Load input parameters from a CSV file (list of CRNs)
    const crnFile = await fs.readFile(`${dataFilePath}${testParams.dataFile}.csv`, 'utf8')
    const crns = crnFile.split('\r\n')

    const start = testParams.start ?? 0
    const end = testParams.end ?? crns.length - 1

    // Call the Oracle package for each CRN, and store alongside existing predictor values from OASYS_SET
    for (let i = start; i <= end; i++) {

        // Get offender and assessment details from the OASys db
        const rescoringOffenderWithAssessment = await getOffenderData('prob', crns[i], testParams.includeLayer1)
        console.log(JSON.stringify(rescoringOffenderWithAssessment))

        if (rescoringOffenderWithAssessment == null || rescoringOffenderWithAssessment.assessment == null) {
            // not found or duplicate CRN, or no assessment of the correct type/status
            results.push({
                crn: crns[i],
                newPredictors: '',
                existingPredictors: '',
                pk: null,
            })
        } else {

            const testCaseParams = createAssessmentTestCase(rescoringOffenderWithAssessment.assessment, testParams)
            const functionCall = getFunctionCall(testCaseParams)

            const oracleOutputValues = await getOgrsResult(functionCall)
            const oracleTestCaseResult = loadOracleOutputValues(oracleOutputValues.split('|'))  // TODO could calculate in Cypress instead?

            results.push({
                crn: crns[i],
                newPredictors: getNewPredictors(oracleTestCaseResult),
                existingPredictors: rescoringOffenderWithAssessment.getOldPredictors(),
                pk: rescoringOffenderWithAssessment.assessment.pk,
            })
        }
    }

    return results
}

function getNewPredictors(outputParams: OutputParameters): string {

    // const predictorValues: string[] = []

    // return predictorValues.join(',')

    return JSON.stringify(outputParams)
}

function getFunctionCall(params: TestCaseParameters): string {

    let result: string[] = []

    result.push(`eor.new_gen_predictors_pkg.get_ogrs4(${dateParameterToString(params.ASSESSMENT_DATE)}`)
    result.push(stringParameterToString(params.STATIC_CALC))
    result.push(dateParameterToString(params.DOB))
    result.push(stringParameterToString(params.GENDER))
    result.push(stringParameterToString(params.OFFENCE_CODE))
    result.push(numericParameterToString(params.TOTAL_SANCTIONS_COUNT))
    result.push(numericParameterToString(params.TOTAL_VIOLENT_SANCTIONS))
    result.push(numericParameterToString(params.CONTACT_ADULT_SANCTIONS))
    result.push(numericParameterToString(params.CONTACT_CHILD_SANCTIONS))
    result.push(numericParameterToString(params.INDECENT_IMAGE_SANCTIONS))
    result.push(numericParameterToString(params.PARAPHILIA_SANCTIONS))
    result.push(stringParameterToString(params.STRANGER_VICTIM))
    result.push(numericParameterToString(params.AGE_AT_FIRST_SANCTION))
    result.push(dateParameterToString(params.LAST_SANCTION_DATE))
    result.push(dateParameterToString(params.DATE_RECENT_SEXUAL_OFFENCE))
    result.push(stringParameterToString(params.CURR_SEX_OFF_MOTIVATION))
    result.push(dateParameterToString(params.MOST_RECENT_OFFENCE))
    result.push(dateParameterToString(params.COMMUNITY_DATE))
    result.push(stringParameterToString(params.ONE_POINT_THIRTY))
    result.push(numericParameterToString(params.TWO_POINT_TWO))
    result.push(numericParameterToString(params.THREE_POINT_FOUR))
    result.push(numericParameterToString(params.FOUR_POINT_TWO))
    result.push(numericParameterToString(params.SIX_POINT_FOUR))
    result.push(numericParameterToString(params.SIX_POINT_SEVEN))
    result.push(numericParameterToString(params.SIX_POINT_EIGHT))
    result.push(numericParameterToString(params.SEVEN_POINT_TWO))
    result.push(stringParameterToString(params.DAILY_DRUG_USER))
    result.push(stringParameterToString(params.AMPHETAMINES))
    result.push(stringParameterToString(params.BENZODIAZIPINES))
    result.push(stringParameterToString(params.CANNABIS))
    result.push(stringParameterToString(params.CRACK_COCAINE))
    result.push(stringParameterToString(params.ECSTASY))
    result.push(stringParameterToString(params.HALLUCINOGENS))
    result.push(stringParameterToString(params.HEROIN))
    result.push(stringParameterToString(params.KETAMINE))
    result.push(stringParameterToString(params.METHADONE))
    result.push(stringParameterToString(params.MISUSED_PRESCRIBED))
    result.push(stringParameterToString(params.OTHER_DRUGS))
    result.push(stringParameterToString(params.OTHER_OPIATE))
    result.push(stringParameterToString(params.POWDER_COCAINE))
    result.push(stringParameterToString(params.SOLVENTS))
    result.push(stringParameterToString(params.SPICE))
    result.push(stringParameterToString(params.STEROIDS))
    result.push(numericParameterToString(params.EIGHT_POINT_EIGHT))
    result.push(numericParameterToString(params.NINE_POINT_ONE))
    result.push(numericParameterToString(params.NINE_POINT_TWO))
    result.push(numericParameterToString(params.ELEVEN_POINT_TWO))
    result.push(numericParameterToString(params.ELEVEN_POINT_FOUR))
    result.push(numericParameterToString(params.TWELVE_POINT_ONE))
    result.push(numericParameterToString(params.OGRS4G_ALGO_VERSION))
    result.push(numericParameterToString(params.OGRS4V_ALGO_VERSION))
    result.push(numericParameterToString(params.OGP2_ALGO_VERSION))
    result.push(numericParameterToString(params.OVP2_ALGO_VERSION))
    result.push(numericParameterToString(params.OSP_ALGO_VERSION))
    result.push(numericParameterToString(params.SNSV_ALGO_VERSION))
    result.push(numericParameterToString(params.AGGRAVATED_BURGLARY))
    result.push(numericParameterToString(params.ARSON))
    result.push(numericParameterToString(params.CRIMINAL_DAMAGE_LIFE))
    result.push(numericParameterToString(params.FIREARMS))
    result.push(numericParameterToString(params.GBH))
    result.push(numericParameterToString(params.HOMICIDE))
    result.push(numericParameterToString(params.KIDNAP))
    result.push(numericParameterToString(params.ROBBERY))
    result.push(numericParameterToString(params.WEAPONS_NOT_FIREARMS))
    result.push(`${stringParameterToString(params.CUSTODY_IND)})`)

    return result.join(',')
}

function dateParameterToString(param: Dayjs): string {

    const result = param?.format('DD-MM-YYYY')
    return result == 'Invalid Date' || result == null ? 'null' : `to_date('${result}','DD-MM-YYYY')`
}

function stringParameterToString(param: string): string {

    return param == null ? 'null' : `'${param}'`
}


function numericParameterToString(param: number): string {

    return param == null ? 'null' : param.toString()
}