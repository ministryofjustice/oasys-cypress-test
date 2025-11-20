import * as db from '../../oasysDb'
import { RebandingOffenderWithAssessment, RebandingAssessment } from './dbClasses'

export async function getOffenderData(crnSource: Provider, crn: string, includeLayer1: boolean): Promise<RebandingOffenderWithAssessment> {

    // Get offender data
    const offenderData = await db.selectData(RebandingOffenderWithAssessment.query(crnSource, crn))
    if (offenderData.error != null) throw new Error(offenderData.error)

    if ((offenderData.data as string[][]).length != 1) {  // No data, or multiple offenders with same CRN
        return null
    }
    const rebandingOffender = new RebandingOffenderWithAssessment(offenderData.data[0])

    // Get OASYS_SET data for the latest complete assessment
    const assessmentData = await db.selectData(RebandingAssessment.query(crnSource, crn, includeLayer1))
    if (assessmentData.error != null) throw new Error(assessmentData.error)
    if ((assessmentData.data as string[][]).length == 0) {  // no suitable assessments
        return rebandingOffender
    }

    // Add OASYS_SET data to the return object
    rebandingOffender.assessment = new RebandingAssessment(assessmentData.data[0])

    // Questions and answers
    const qaData = await db.selectData(RebandingAssessment.qaQuery(rebandingOffender.assessment.pk))
    if (qaData.error != null) throw new Error(qaData.error)
    rebandingOffender.assessment.qaData = qaData.data as string[][]

    const textData = await db.selectData(RebandingAssessment.textAnswerQuery(rebandingOffender.assessment.pk))
    if (textData.error != null) throw new Error(textData.error)
    rebandingOffender.assessment.textData = textData.data as string[][]

    // Offence
    const offencesData = await db.selectData(RebandingAssessment.offenceQuery(rebandingOffender.assessment.pk))
    if (offencesData.error != null) throw new Error(offencesData.error)
    const offences = offencesData.data as string[][]
    if (offences.length > 0 && offences[0].length > 0) {
        rebandingOffender.assessment.offence = offences[0][0]
    }
}

