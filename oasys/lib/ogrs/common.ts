import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import isLeapYear from 'dayjs/plugin/isLeapYear'

import { TestCaseParameters, OgrsOffenceCat } from './types'
import { offenceCats, offences } from './data/offences'
import { getData } from '../db'

let offencesLoaded = false

export function addCalculatedInputParameters(p: TestCaseParameters) {

    p.effectiveAssessmentDate = p.COMMUNITY_DATE == null ? p.LAST_SANCTION_DATE : p.COMMUNITY_DATE
    p.age = getDateDiff(p.DOB, p.effectiveAssessmentDate, 'year')
    p.ageAtLastSanction = getDateDiff(p.DOB, p.LAST_SANCTION_DATE, 'year')
    p.ageAtLastSanctionSexual = getDateDiff(p.DOB, p.DATE_RECENT_SEXUAL_OFFENCE, 'year')
    p.ofm = getDateDiff(p.effectiveAssessmentDate, p.ASSESSMENT_DATE, 'month', true)
    p.offenceCat = getOffenceCat(p.OFFENCE_CODE)
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


function getDateDiff(firstDate: dayjs.Dayjs, secondDate: dayjs.Dayjs, unit: 'year' | 'month', ofm: boolean = false): number {

    dayjs.extend(isLeapYear)
    if (firstDate == null || secondDate == null) {
        return null
    }
    let diff = secondDate.diff(firstDate, unit)

    // Leap-year fix - if dob = 29/2, 28/2 is not a birthday on a non-leap year; the DaysJS calculation doesn't work like that
    if (unit == 'year' && firstDate.date() == 29 && firstDate.month() == 1 && secondDate.date() == 28 && secondDate.month() == 1 && !secondDate.isLeapYear()) {
        diff--
    }

    if (ofm) {
        return diff < 0 ? 0 : diff > 36 ? 36 : diff
    } else {
        return diff >= 0 ? diff : null
    }
}

export function getOffenceCat(offence: string): OgrsOffenceCat {

    const cat = offenceCats[offences[offence]]
    return cat == undefined ? null : cat
}

export function loadOffenceCodeData() {

    if (!offencesLoaded) {
        // Load offence codes from OASys
        const query = 'select offence_group_code || sub_code, rsr_category_desc from eor.ct_offence order by 1'

        getData(query, 'offenceCodeData')
        cy.get<string[][]>('@offenceCodeData').then((offenceCodes) => {
            offenceCodes.forEach(offence => {
                offences[offence[0]] = offence[1]
            })
        })
        offencesLoaded = true
    }

}