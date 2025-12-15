import * as db from '../../oasysDb'
import { RescoringOffenderWithAssessment, RescoringAssessment } from './dbClasses'

export async function getOffenderData(crnSource: Provider, crn: string, includeLayer1: boolean): Promise<RescoringOffenderWithAssessment> {


    // Get OASYS_SET data for the latest complete assessment
    const assessmentData = await db.selectData(RescoringAssessment.query(crnSource, crn, includeLayer1))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    if ((assessmentData.data as string[][]).length == 0) {  // no suitable assessments
        return null
    }

    // Create the return object with oasys_set data
    const rescoringOffender = new RescoringOffenderWithAssessment(assessmentData.data[0])

    //Look up the offender pk
    const offenderData = await db.selectSingleValue(rescoringOffender.offenderPkQuery())
    if (offenderData.error != null) throw new Error(offenderData.error)
    rescoringOffender.offenderPk = offenderData.data as number

    // Questions and answers
    const qaData = await db.selectData(RescoringAssessment.qaQuery(rescoringOffender.assessment.pk))
    if (qaData.error != null) throw new Error(qaData.error)
    rescoringOffender.assessment.qaData = qaData.data as string[][]

    const textData = await db.selectData(RescoringAssessment.textAnswerQuery(rescoringOffender.assessment.pk))
    if (textData.error != null) throw new Error(textData.error)
    rescoringOffender.assessment.textData = textData.data as string[][]

    // Offence
    const offencesData = await db.selectData(RescoringAssessment.offenceQuery(rescoringOffender.assessment.pk))
    if (offencesData.error != null) throw new Error(offencesData.error)
    const offences = offencesData.data as string[][]
    if (offences.length > 0 && offences[0].length > 0) {
        rescoringOffender.assessment.offence = offences[0][0]
    }

    return rescoringOffender
}

