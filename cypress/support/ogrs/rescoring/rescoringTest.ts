import * as fs from 'fs-extra'

import { OutputParameters, RescoringResult, RescoringTestParameters, TestCaseParameters } from '../../../../oasys/ogrs/types'
import { getOgrsResult } from '../../oasysDb'
import { Dayjs } from 'dayjs'
import { getOffenderData } from './getOffenderData'
import { createAssessmentTestCase } from './createAssessmentTestCase'
import { dateParameterToString, stringParameterToString, numericParameterToString, numericParameterToCsvOutputString, stringParameterToCsvOutputString, dateParameterToCsvOutputString } from 'lib/utils'
import { loadOracleOutputValues } from '../loadTestData'
import { RescoringOffenderWithAssessment } from './dbClasses'

const dataFilePath = './cypress/support/ogrs/data/'
const outputPath = './cypress/downloads/'
export const dateFormat = 'DD-MM-YYYY'

export async function rescoringTest(testParams: RescoringTestParameters): Promise<RescoringResult[]> {

    const results: RescoringResult[] = []

    // Load input parameters from a CSV file (list of CRNs)
    const crnFile = await fs.readFile(`${dataFilePath}${testParams.dataFile}.csv`, 'utf8')
    const crns = crnFile.split('\r\n')

    const start = testParams.start ?? 0
    const end = testParams.end ?? crns.length - 1

    // Call the Oracle package for each CRN, and store alongside existing predictor values from OASYS_SET
    for (let i = start; i <= end; i++) {

        // Get offender and assessment details from the OASys db
        const probationCrn = crns[i].split(',')[0]
        const nomisId = crns[i].split(',')[1]
        const rescoringOffenderWithAssessment = await getOffenderData(probationCrn == '' ? 'pris' : 'prob', probationCrn == '' ? nomisId : probationCrn, testParams.includeLayer1)

        if (rescoringOffenderWithAssessment == null || rescoringOffenderWithAssessment.assessment == null) {
            // not found or duplicate CRN, or no assessment of the correct type/status
            results.push({
                crn: crns[i],
                pk: null,
            })
            await fs.appendFile(`${outputPath}${testParams.outputFile}.csv`, '\n', 'utf8')
        } else {

            const testCaseParams = createAssessmentTestCase(rescoringOffenderWithAssessment.assessment, testParams)
            const functionCall = getFunctionCall(testCaseParams)

            const oracleOutputValues = await getOgrsResult(functionCall)
            const oracleTestCaseResult = loadOracleOutputValues(oracleOutputValues.split('|'))

            const result: RescoringResult = {
                crn: crns[i],
                pk: rescoringOffenderWithAssessment.assessment.pk,
            }
            await fs.appendFile(`${outputPath}${testParams.outputFile}.csv`,
                createOutputLine(testCaseParams, rescoringOffenderWithAssessment, oracleTestCaseResult, testParams.runNumber),
                'utf8'
            )

            results.push(result)
        }
    }

    return results
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

function createOutputLine(params: TestCaseParameters, offender: RescoringOffenderWithAssessment, outputParams: OutputParameters, runNumber: string): string {

    const metadata: string[] = []
    metadata.push(runNumber)
    metadata.push(offender.assessment.probationCrn)
    metadata.push(offender.assessment.nomisId)
    metadata.push(offender.assessment.pk.toString())
    metadata.push(offender.offenderPk.toString())
    metadata.push(offender.assessment.completedDate)
    metadata.push(offender.assessment.type)
    metadata.push(offender.assessment.purpose)

    const output: string[] = []
    output.push(outputParams.RSR_BAND)
    output.push(outputParams.RSR_CALCULATED != 'Y' ? '' : outputParams.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : 'STATIC')
    output.push(outputParams.RSR_PERCENTAGE?.toString())
    output.push(outputParams.OSP_DC_CALCULATED == 'A' ? 'NA' : outputParams.OSP_DC_BAND)
    output.push(outputParams.OSP_DC_PERCENTAGE?.toString())
    output.push(outputParams.OSP_IIC_CALCULATED == 'A' ? 'NA' : outputParams.OSP_IIC_BAND)
    output.push(outputParams.OSP_IIC_PERCENTAGE?.toString())
    output.push(outputParams.SNSV_BAND_STATIC)
    output.push(outputParams.SNSV_PERCENTAGE_STATIC?.toString())
    output.push(outputParams.SNSV_BAND_DYNAMIC)
    output.push(outputParams.SNSV_PERCENTAGE_DYNAMIC?.toString())
    output.push(outputParams.OGRS4G_BAND)
    output.push(outputParams.OGRS4G_PERCENTAGE?.toString())
    output.push(outputParams.OGRS4V_BAND)
    output.push(outputParams.OGRS4V_PERCENTAGE?.toString())
    output.push(outputParams.OGP2_BAND)
    output.push(outputParams.OGP2_PERCENTAGE?.toString())
    output.push(outputParams.OVP2_BAND)
    output.push(outputParams.OVP2_PERCENTAGE?.toString())

    const inputParams = getInputsForOutputLine(params)
    const oldResults = offender.getOldPredictors()

    return `${metadata.join()},${oldResults},${inputParams},${output.join()}\n`
}

function getInputsForOutputLine(params: TestCaseParameters) {

    let result: string[] = []

    result.push(dateParameterToCsvOutputString(params.ASSESSMENT_DATE))
    result.push(stringParameterToCsvOutputString(params.STATIC_CALC))
    result.push(dateParameterToCsvOutputString(params.DOB))
    result.push(stringParameterToCsvOutputString(params.GENDER))
    result.push(stringParameterToCsvOutputString(params.OFFENCE_CODE))
    result.push(numericParameterToCsvOutputString(params.TOTAL_SANCTIONS_COUNT))
    result.push(numericParameterToCsvOutputString(params.TOTAL_VIOLENT_SANCTIONS))
    result.push(numericParameterToCsvOutputString(params.CONTACT_ADULT_SANCTIONS))
    result.push(numericParameterToCsvOutputString(params.CONTACT_CHILD_SANCTIONS))
    result.push(numericParameterToCsvOutputString(params.INDECENT_IMAGE_SANCTIONS))
    result.push(numericParameterToCsvOutputString(params.PARAPHILIA_SANCTIONS))
    result.push(stringParameterToCsvOutputString(params.STRANGER_VICTIM))
    result.push(numericParameterToCsvOutputString(params.AGE_AT_FIRST_SANCTION))
    result.push(dateParameterToCsvOutputString(params.LAST_SANCTION_DATE))
    result.push(dateParameterToCsvOutputString(params.DATE_RECENT_SEXUAL_OFFENCE))
    result.push(stringParameterToCsvOutputString(params.CURR_SEX_OFF_MOTIVATION))
    result.push(dateParameterToCsvOutputString(params.MOST_RECENT_OFFENCE))
    result.push(dateParameterToCsvOutputString(params.COMMUNITY_DATE))
    result.push(stringParameterToCsvOutputString(params.ONE_POINT_THIRTY))
    result.push(numericParameterToCsvOutputString(params.TWO_POINT_TWO))
    result.push(numericParameterToCsvOutputString(params.THREE_POINT_FOUR))
    result.push(numericParameterToCsvOutputString(params.FOUR_POINT_TWO))
    result.push(numericParameterToCsvOutputString(params.SIX_POINT_FOUR))
    result.push(numericParameterToCsvOutputString(params.SIX_POINT_SEVEN))
    result.push(numericParameterToCsvOutputString(params.SIX_POINT_EIGHT))
    result.push(numericParameterToCsvOutputString(params.SEVEN_POINT_TWO))
    result.push(stringParameterToCsvOutputString(params.DAILY_DRUG_USER))
    result.push(stringParameterToCsvOutputString(params.AMPHETAMINES))
    result.push(stringParameterToCsvOutputString(params.BENZODIAZIPINES))
    result.push(stringParameterToCsvOutputString(params.CANNABIS))
    result.push(stringParameterToCsvOutputString(params.CRACK_COCAINE))
    result.push(stringParameterToCsvOutputString(params.ECSTASY))
    result.push(stringParameterToCsvOutputString(params.HALLUCINOGENS))
    result.push(stringParameterToCsvOutputString(params.HEROIN))
    result.push(stringParameterToCsvOutputString(params.KETAMINE))
    result.push(stringParameterToCsvOutputString(params.METHADONE))
    result.push(stringParameterToCsvOutputString(params.MISUSED_PRESCRIBED))
    result.push(stringParameterToCsvOutputString(params.OTHER_OPIATE))
    result.push(stringParameterToCsvOutputString(params.POWDER_COCAINE))
    result.push(stringParameterToCsvOutputString(params.SOLVENTS))
    result.push(stringParameterToCsvOutputString(params.SPICE))
    result.push(stringParameterToCsvOutputString(params.STEROIDS))
    result.push(stringParameterToCsvOutputString(params.OTHER_DRUGS))
    result.push(numericParameterToCsvOutputString(params.EIGHT_POINT_EIGHT))
    result.push(numericParameterToCsvOutputString(params.NINE_POINT_ONE))
    result.push(numericParameterToCsvOutputString(params.NINE_POINT_TWO))
    result.push(numericParameterToCsvOutputString(params.ELEVEN_POINT_TWO))
    result.push(numericParameterToCsvOutputString(params.ELEVEN_POINT_FOUR))
    result.push(numericParameterToCsvOutputString(params.TWELVE_POINT_ONE))
    result.push(numericParameterToCsvOutputString(params.OGRS4G_ALGO_VERSION))
    result.push(numericParameterToCsvOutputString(params.OGRS4V_ALGO_VERSION))
    result.push(numericParameterToCsvOutputString(params.OGP2_ALGO_VERSION))
    result.push(numericParameterToCsvOutputString(params.OVP2_ALGO_VERSION))
    result.push(numericParameterToCsvOutputString(params.OSP_ALGO_VERSION))
    result.push(numericParameterToCsvOutputString(params.SNSV_ALGO_VERSION))
    result.push(numericParameterToCsvOutputString(params.AGGRAVATED_BURGLARY))
    result.push(numericParameterToCsvOutputString(params.ARSON))
    result.push(numericParameterToCsvOutputString(params.CRIMINAL_DAMAGE_LIFE))
    result.push(numericParameterToCsvOutputString(params.FIREARMS))
    result.push(numericParameterToCsvOutputString(params.GBH))
    result.push(numericParameterToCsvOutputString(params.HOMICIDE))
    result.push(numericParameterToCsvOutputString(params.KIDNAP))
    result.push(numericParameterToCsvOutputString(params.ROBBERY))
    result.push(numericParameterToCsvOutputString(params.WEAPONS_NOT_FIREARMS))
    result.push(stringParameterToCsvOutputString(params.CUSTODY_IND))

    return result.join(',')
}
