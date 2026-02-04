import * as db from '../../oasysDb'
import { OgrsRsr } from './dbClasses'
import { OgrsAssessment } from './dbClasses'

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

export async function getOneAssessment(assessmentPk: number): Promise<OgrsAssessment> {

    const assessments = await getAssessmentTestData(1, `oasys_set_pk = '${assessmentPk}'`)
    if (assessments.length == 0) {
        throw new Error(`Assessment not found: ${assessmentPk}`)
    }
    return assessments[0]
}

export async function getAssessmentTestData(rows: number, whereClause: string): Promise<OgrsAssessment[]> {

    const assessmentData = await db.selectData(OgrsAssessment.query(rows, whereClause))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    const assessments = assessmentData.data as string[][]

    const result: OgrsAssessment[] = []
    for (let a = 0; a < assessments.length; a++) {
        // Add OASYS_SET data to the return object
        const assessment = new OgrsAssessment(assessments[a])

        // Questions and answers
        const qaData = await db.selectData(OgrsAssessment.qaQuery(assessment.pk))
        if (qaData.error != null) throw new Error(qaData.error)

        assessment.qaData = {}
        const qa = qaData.data as string[][]
        qa.forEach((q) => {
            if (assessment.qaData[q[0]] == undefined) {
                assessment.qaData[q[0]] = q[1]
            } else {
                assessment.qaData[q[0]] += `,${q[1]}`  // Questions with multiple answers go into a single comma-separated string
            }
        })

        // Offence
        const offencesData = await db.selectData(OgrsAssessment.offenceQuery(assessment.pk))
        if (offencesData.error != null) throw new Error(offencesData.error)
        const offences = offencesData.data as string[][]
        if (offences.length > 0 && offences[0].length > 0) {
            assessment.offence = offences[0][0]
        }

        result.push(assessment)
    }
    return result
}

