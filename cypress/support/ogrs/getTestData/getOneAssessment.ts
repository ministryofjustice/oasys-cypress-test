import { stringToFloat } from 'lib/utils'
import { OasysDateTime } from 'lib/dateTime'
import * as db from '../../oasysDb'

export async function getOneAssessment(assessmentPk: number): Promise<OgrsRegressionTestAssessment> {

    const assessmentData = await db.selectData(OgrsRegressionTestAssessment.query(assessmentPk))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    const assessments = assessmentData.data as string[][]
    if (assessments.length == 0) throw new Error(`Assessment not found: ${assessmentPk}`)

    // Add OASYS_SET data to the return object
    const assessment = new OgrsRegressionTestAssessment(assessmentPk, assessments[0])

    // Questions and answers
    const qaData = await db.selectData(OgrsRegressionTestAssessment.qaQuery(assessmentPk))
    if (qaData.error != null) throw new Error(qaData.error)

    assessment.qaData = {}
    const qa = qaData.data as string[][]
    qa.forEach((q) => {
        assessment.qaData[q[0]] = q[1]
    })

    // Offence
    const offencesData = await db.selectData(OgrsRegressionTestAssessment.offenceQuery(assessmentPk))
    if (offencesData.error != null) throw new Error(offencesData.error)
    const offences = offencesData.data as string[][]
    if (offences.length > 0 && offences[0].length > 0) {
        assessment.offence = offences[0][0]
    }

    return assessment
}

export class OgrsRegressionTestAssessment {

    pk: number
    type: string
    version: number
    dob: string
    gender: string
    prisonInd: string

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogrs4vYr2: number
    ogrs4vBand: string
    ogrs4vCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string
    ovp2Yr2: number
    ovp2Band: string
    ovp2Calculated: string
    snsvStaticYr2: number
    snsvStaticYr2Band: string
    snsvStaticCalculated: string
    snsvDynamicYr2: number
    snsvDynamicYr2Band: string
    snsvDynamicCalculated: string

    offence: string
    qaData: {}

    constructor(assessmentPk: number, assessmentData: string[]) {

        let i = 0
        this.pk = assessmentPk
        this.type = assessmentData[i++]
        this.version = Number.parseInt(assessmentData[i++])
        this.dob = assessmentData[i++]
        this.gender = assessmentData[i++]
        this.prisonInd = assessmentData[i++]

        this.ogrs4gYr2 = stringToFloat(assessmentData[i++])
        this.ogrs4gBand = assessmentData[i++]
        this.ogrs4gCalculated = assessmentData[i++]
        this.ogrs4vYr2 = stringToFloat(assessmentData[i++])
        this.ogrs4vBand = assessmentData[i++]
        this.ogrs4vCalculated = assessmentData[i++]
        this.ogp2Yr2 = stringToFloat(assessmentData[i++])
        this.ogp2Band = assessmentData[i++]
        this.ogp2Calculated = assessmentData[i++]
        this.ovp2Yr2 = stringToFloat(assessmentData[i++])
        this.ovp2Band = assessmentData[i++]
        this.ovp2Calculated = assessmentData[i++]
        this.snsvStaticYr2 = stringToFloat(assessmentData[i++])
        this.snsvStaticYr2Band = assessmentData[i++]
        this.snsvStaticCalculated = assessmentData[i++]
        this.snsvDynamicYr2 = stringToFloat(assessmentData[i++])
        this.snsvDynamicYr2Band = assessmentData[i++]
        this.snsvDynamicCalculated = assessmentData[i++]
    }

    static query(assessmentPk): string {

        return `select assessment_type_elm, version_number, to_char(date_of_birth, '${OasysDateTime.dateFormat}'), gender_elm, prison_ind,
                        ogrs4g_percentage_2yr, ogrs4g_band_risk_recon_elm, ogrs4g_calculated, 
                        ogrs4v_percentage_2yr, ogrs4v_band_risk_recon_elm, ogrs4v_calculated, 
                        ogp2_percentage_2yr, ogp2_band_risk_recon_elm, ogp2_calculated, 
                        ovp2_percentage_2yr, ovp2_band_risk_recon_elm, ovp2_calculated, 
                        snsv_percentage_2yr_static, snsv_stat_band_risk_recon_elm, snsv_calculated_static, 
                        snsv_percentage_2yr_dynamic, snsv_dyn_band_risk_recon_elm, snsv_calculated_dynamic
                    from eor.oasys_set 
                    where oasys_set_pk = '${assessmentPk}'
                    order by create_date desc`
    }

    static offenceQuery(assessmentPk: number): string {

        return `select p.offence_group_code || p.sub_code 
                    from eor.offence_block o, eor.ct_offence_pivot p
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT'
                    and p.offence_block_pk = o.offence_block_pk and p.additional_offence_ind = 'N'`
    }

    static qaQuery(assessmentPk: number): string {

        return `SELECT REF_QUESTION_CODE, ANSWER
                    FROM
                    (
                    SELECT OQ.REF_QUESTION_CODE, DECODE(OQ.FREE_FORMAT_ANSWER,null,OA.REF_ANSWER_CODE,OQ.FREE_FORMAT_ANSWER) ANSWER
                    FROM EOR.OASYS_SET OS
                    LEFT OUTER JOIN EOR.OASYS_SECTION OSEC
                    ON OSEC.OASYS_SET_PK = OS.OASYS_SET_PK
                    LEFT OUTER JOIN EOR.OASYS_QUESTION OQ
                    ON OQ.OASYS_SECTION_PK = OSEC.OASYS_SECTION_PK
                    LEFT OUTER JOIN EOR.OASYS_ANSWER OA
                    ON OA.OASYS_QUESTION_PK = OQ.OASYS_QUESTION_PK
                    WHERE OS.OASYS_SET_PK = ${assessmentPk}
                    AND OQ.CURRENTLY_HIDDEN_IND = 'N'
                    AND OQ.REF_QUESTION_CODE IN ('1.39','1.32','1.40','1.34','1.45','1.46','1.37','1.44','1.8','1.29','1.33','1.38','1.41','1.43','1.30',
                                                '2.2_V2_WEAPON',
                                                '3.4',
                                                '4.2',
                                                '6.4',
                                                '6.7da',
                                                '6.7.2.1da',
                                                '6.8',
                                                '7.2',
                                                '8.1','8.2.8.1','8.2.7.1','8.2.11.1','8.2.4.1','8.2.10.1','8.2.9.1','8.2.1.1','8.2.16.1','8.2.2.1',
                                                '8.2.6.1','8.2.3.1','8.2.5.1','8.2.12.1','8.2.15.1','8.2.13.1','8.2.14.1',
                                                '8.8',
                                                '9.1',
                                                '9.2',
                                                '11.2',
                                                '11.4',
                                                '12.1',
                                                'R1.2.6.2_V2','R1.2.7.2_V2','R1.2.8.2_V2','R1.2.10.2_V2','R1.2.2.2_V2','R1.2.1.2_V2','R1.2.9.2_V2',
                                                'R1.2.12.2_V2','R1.2.13.2_V2' )
                    ) `
    }
}