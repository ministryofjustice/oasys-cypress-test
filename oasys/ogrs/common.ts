import { TestCaseParameters, OgrsOffenceCat } from './types'
import { offenceCats } from './data/offences'
import { lookupString } from 'lib/utils'
import { OasysDateTime } from 'lib/dateTime'

export function addCalculatedInputParameters(p: TestCaseParameters, offences: {}) {

    p.effectiveAssessmentDate = p.COMMUNITY_DATE == null ? p.LAST_SANCTION_DATE : p.COMMUNITY_DATE
    p.age = OasysDateTime.dateDiff(p.DOB, p.effectiveAssessmentDate, 'year')
    p.ageAtLastSanction = OasysDateTime.dateDiff(p.DOB, p.LAST_SANCTION_DATE, 'year')
    p.ageAtLastSanctionSexual = OasysDateTime.dateDiff(p.DOB, p.DATE_RECENT_SEXUAL_OFFENCE, 'year')
    p.ofm = OasysDateTime.dateDiff(p.effectiveAssessmentDate, p.ASSESSMENT_DATE, 'month', true)
    p.offenceCat = getOffenceCat(p.OFFENCE_CODE, offences)
    p.firstSanction = p.TOTAL_SANCTIONS_COUNT == 1
    p.secondSanction = p.TOTAL_SANCTIONS_COUNT == 2
    p.yearsBetweenFirstTwoSanctions = p.secondSanction ? p.ageAtLastSanction - p.AGE_AT_FIRST_SANCTION : 0
    p.neverSanctionedViolence = p.TOTAL_VIOLENT_SANCTIONS == 0
    p.onceViolent = p.TOTAL_VIOLENT_SANCTIONS == 1
    p.male = p.GENDER == 'M'
    p.female = p.GENDER == 'F'
    p.out5Years = OasysDateTime.dateDiff(p.COMMUNITY_DATE, p.ASSESSMENT_DATE, 'year') >= 5

    const offenceInLast5Years = OasysDateTime.dateDiff(p.MOST_RECENT_OFFENCE, p.ASSESSMENT_DATE, 'year')
    p.offenceInLast5Years = offenceInLast5Years == null ? false : offenceInLast5Years < 5
    const sexualOffenceInLast5Years = OasysDateTime.dateDiff(p.DATE_RECENT_SEXUAL_OFFENCE, p.ASSESSMENT_DATE, 'year')
    p.sexualOffenceInLast5Years = sexualOffenceInLast5Years == null ? false : sexualOffenceInLast5Years < 5

    p.zeroSexualSanctions = p.CONTACT_ADULT_SANCTIONS == 0 && p.CONTACT_CHILD_SANCTIONS == 0 && p.INDECENT_IMAGE_SANCTIONS == 0 && p.PARAPHILIA_SANCTIONS == 0
}

export function getOffenceCat(offence: string, offences: {}): OgrsOffenceCat {

    const cat = offenceCats[offences[offence]]
    return cat == undefined ? null : cat
}

export function q141(q130: string, q141: string, offence: string, offences: {}): string {

    const offenceCat = getOffenceCat(offence, offences)
    const sexualOffence = offenceCat && ['sexual_offences_not_children', 'sexual_offences_children'].includes(offenceCat.cat)

    if (q130 != 'YES' || sexualOffence || (q130 == 'YES' && sexualOffence)) {
        return 'O'
    } else if (q130 == 'YES' && q141 == null) {
        return 'O'
    }
    return q141
}

export function q22(q22Weapon: string): number {

    return q22Weapon == null ? null : q22Weapon == 'YES' ? 1 : 0
}

export function da(q67: string, q67da: string): number {

    return (q67 == 'YES' ? q67da : q67) == 'YES' ? 1 : 0
}


export function dailyDrugUser(q81: string, drugs: {}): 'Y' | 'N' {

    if (q81 != 'YES') {
        return q81 == 'NO' ? 'N' : null
    }

    let result: 'Y' | 'N' = 'N'
    Object.keys(drugs).forEach((key) => {
        if (drugs[key] == '100') {
            result = 'Y'
        }
    })

    return result
}

export function q88(q81: string, q88: number): number {

    return q81 == 'YES' ? q88 : q81 == 'NO' ? 0 : null
}

export function getDrugUsed(drug: string, drugs: {}): 'Y' {

    return drugs[drug] == null ? null : 'Y'
}

export function getDrugsUsage(data: {}): {} {

    return {
        HEROIN: lookupString('8.2.1.1', data),
        ECSTASY: lookupString('8.2.10.1', data),
        CANNABIS: lookupString('8.2.11.1', data),
        SOLVENTS: lookupString('8.2.12.1', data),
        STEROIDS: lookupString('8.2.13.1', data),
        SPICE: lookupString('8.2.15.1', data),
        OTHER_DRUGS: lookupString('8.2.14.1', data),
        METHADONE: lookupString('8.2.2.1', data),
        OTHER_OPIATE: lookupString('8.2.3.1', data),
        CRACK_COCAINE: lookupString('8.2.4.1', data),
        POWDER_COCAINE: lookupString('8.2.5.1', data),
        MISUSED_PRESCRIBED: lookupString('8.2.6.1', data),
        BENZODIAZIPINES: lookupString('8.2.7.1', data),
        AMPHETAMINES: lookupString('8.2.8.1', data),
        HALLUCINOGENS: lookupString('8.2.9.1', data),
        KETAMINE: lookupString('8.2.16.1', data),
    }

}
