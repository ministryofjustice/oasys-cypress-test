import { Temporal } from '@js-temporal/polyfill'

import { TestCaseParameters, OgrsOffenceCat } from './types'
import { offenceCats } from './data/offences'

export function addCalculatedInputParameters(p: TestCaseParameters, offences: {}) {

    p.effectiveAssessmentDate = p.COMMUNITY_DATE == null ? p.LAST_SANCTION_DATE : p.COMMUNITY_DATE
    p.age = getDateDiff(p.DOB, p.effectiveAssessmentDate, 'year')
    p.ageAtLastSanction = getDateDiff(p.DOB, p.LAST_SANCTION_DATE, 'year')
    p.ageAtLastSanctionSexual = getDateDiff(p.DOB, p.DATE_RECENT_SEXUAL_OFFENCE, 'year')
    p.ofm = getDateDiff(p.effectiveAssessmentDate, p.ASSESSMENT_DATE, 'month', true)
    p.offenceCat = getOffenceCat(p.OFFENCE_CODE, offences)
    p.firstSanction = p.TOTAL_SANCTIONS_COUNT == 1
    p.secondSanction = p.TOTAL_SANCTIONS_COUNT == 2
    p.yearsBetweenFirstTwoSanctions = p.secondSanction ? p.ageAtLastSanction - p.AGE_AT_FIRST_SANCTION : 0
    p.neverSanctionedViolence = p.TOTAL_VIOLENT_SANCTIONS == 0
    p.onceViolent = p.TOTAL_VIOLENT_SANCTIONS == 1
    p.male = p.GENDER == 'M'
    p.female = p.GENDER == 'F'
    p.out5Years = getDateDiff(p.COMMUNITY_DATE, p.ASSESSMENT_DATE, 'year') >= 5

    const offenceInLast5Years = getDateDiff(p.MOST_RECENT_OFFENCE, p.ASSESSMENT_DATE, 'year')
    p.offenceInLast5Years = offenceInLast5Years == null ? false : offenceInLast5Years < 5
    const sexualOffenceInLast5Years = getDateDiff(p.DATE_RECENT_SEXUAL_OFFENCE, p.ASSESSMENT_DATE, 'year')
    p.sexualOffenceInLast5Years = sexualOffenceInLast5Years == null ? false : sexualOffenceInLast5Years < 5

    p.zeroSexualSanctions = p.CONTACT_ADULT_SANCTIONS == 0 && p.CONTACT_CHILD_SANCTIONS == 0 && p.INDECENT_IMAGE_SANCTIONS == 0 && p.PARAPHILIA_SANCTIONS == 0
}


function getDateDiff(firstDate: Temporal.PlainDate, secondDate: Temporal.PlainDate, unit: 'year' | 'month', ofm: boolean = false): number {

    if (firstDate == null || secondDate == null) {
        return null
    }
    const dateDiff = secondDate.since(firstDate, { smallestUnit: unit, largestUnit: unit })
    let diff = unit == 'month' ? dateDiff.months : dateDiff.years

    // Leap-year fix - if dob = 29/2, 28/2 is not a birthday on a non-leap year; the calculation doesn't work like that
    if (unit == 'year' && firstDate.day == 29 && firstDate.month == 1 && secondDate.day == 28 && secondDate.month == 1 && !secondDate.inLeapYear) {
        diff--
    }

    if (ofm) {
        return diff < 0 ? 0 : diff > 36 ? 36 : diff
    } else {
        return diff >= 0 ? diff : null
    }
}

export function getOffenceCat(offence: string, offences: {}): OgrsOffenceCat {

    const cat = offenceCats[offences[offence]]
    return cat == undefined ? null : cat
}
