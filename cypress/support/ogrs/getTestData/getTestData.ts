import * as db from '../../oasysDb'
import { OgrsRsr } from './dbClasses'
import { getOneAssessment, OgrsAssessment } from './getOneAssessment'

export async function getAssessmentTestData(rows: number, whereClause: string): Promise<OgrsAssessment[]> {

    // TODO combine this with the query for getOneAssessment
    const query = `select oasys_set_pk from eor.oasys_set where ${whereClause} order by initiation_date desc fetch first ${rows} rows only`
    const assessmentData = await db.selectData(query)
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    const assessments = assessmentData.data as string[][]

    const result: OgrsAssessment[] = []
    for (let a = 0; a < assessments.length; a++) {
        const assessment = await getOneAssessment(Number.parseInt(assessments[a][0]))
        result.push(assessment)
    }

    return result
}


export async function getRsrTestData(rows: number, whereClause: string): Promise<OgrsRsr[]> {

    const rsrData = await db.selectData(OgrsRsr.query(rows, whereClause))
    if (rsrData.error != null) throw new Error(rsrData.error)
    const rsrs = rsrData.data as string[][]

    const result: OgrsRsr[] = []
    for (let a = 0; a < rsrs.length; a++) {
        const rsr = new OgrsRsr(rsrs[a])
        result.push(rsr)
    }

    return result
}
