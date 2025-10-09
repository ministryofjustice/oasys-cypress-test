import * as db from '../../oasysDb'
import { DbOffence, OgrsAssessment } from './dbClasses'

export async function getTestData(rows: number): Promise<OgrsAssessment[]> {

    const assessmentData = await db.selectData(OgrsAssessment.query(rows))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    const assessments = assessmentData.data as string[][]

    const result: OgrsAssessment[] = []
    for (let a = 0; a < assessments.length; a++) {
        const assessment = await getAssessment(assessments[a])
        result.push(assessment)
    }

    return result
}

export async function getAssessment(assessmentData: string[]): Promise<OgrsAssessment> {

    // Add OASYS_SET data to the return object
    const assessment = new OgrsAssessment(assessmentData)

    // Questions and answers
    const qaData = await db.selectData(OgrsAssessment.qaQuery(assessment.assessmentPk))
    if (qaData.error != null) throw new Error(qaData.error)
    assessment.qaData = qaData.data as string[][]

    const textData = await db.selectData(OgrsAssessment.textAnswerQuery(assessment.assessmentPk))
    if (textData.error != null) throw new Error(textData.error)
    assessment.textData = textData.data as string[][]

    // Offences
    const offencesData = await db.selectData(DbOffence.query(assessment.assessmentPk))
    if (offencesData.error != null) throw new Error(offencesData.error)
    const offences = offencesData.data as string[][]

    for (let o = 0; o < offences.length; o++) {
        const offencePivotData = await db.selectData(DbOffence.pivotQuery(offences[o][0]))  // Search by offence_block_pk
        if (offencePivotData.error != null) throw new Error(offencePivotData.error)

        const offencePivot = offencePivotData.data as string[][]
        if (offencePivot.length == 0) {
            assessment.offences.push(new DbOffence(offences[o], null))
        } else {
            offencePivot.forEach((p) => {
                assessment.offences.push(new DbOffence(offences[o], p))
            })
        }
    }

    return assessment
}

