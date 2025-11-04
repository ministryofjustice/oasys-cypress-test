import * as db from '../../oasysDb'
import { OgrsAssessment, OgrsRsr } from './dbClasses'

export async function getAssessmentTestData(rows: number, whereClause: string): Promise<OgrsAssessment[]> {

    const assessmentData = await db.selectData(OgrsAssessment.query(rows, whereClause))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    const assessments = assessmentData.data as string[][]

    const result: OgrsAssessment[] = []
    for (let a = 0; a < assessments.length; a++) {
        const assessment = await getAssessment(assessments[a])
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

export async function getAssessment(assessmentData: string[]): Promise<OgrsAssessment> {

    // Add OASYS_SET data to the return object
    const assessment = new OgrsAssessment(assessmentData)

    // Questions and answers
    const qaData = await db.selectData(OgrsAssessment.qaQuery(assessment.pk))
    if (qaData.error != null) throw new Error(qaData.error)
    assessment.qaData = qaData.data as string[][]

    const textData = await db.selectData(OgrsAssessment.textAnswerQuery(assessment.pk))
    if (textData.error != null) throw new Error(textData.error)
    assessment.textData = textData.data as string[][]

    // Offence
    const offencesData = await db.selectData(OgrsAssessment.offenceQuery(assessment.pk))
    if (offencesData.error != null) throw new Error(offencesData.error)
    const offences = offencesData.data as string[][]
    if (offences.length > 0 && offences[0].length > 0) {
        assessment.offence = offences[0][0]
    }

    return assessment
}
