export const baseOffenderProb: OffenderDef = {

    forename1: 'Offender',
    gender: 'Male',
    dateOfBirth: { years: -20 },

    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

export const baseOffenderPris: OffenderDef = {

    forename1: 'Offender',
    gender: 'Male',
    dateOfBirth: { years: -20 },

    event: {
        eventDetails: {
            sentenceType: 'Custody (1 to 4 yrs - ACR)',
            sentenceDate: { months: -6 },
            sentenceMonths: 24,
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

export const probNonSanOffenders: { forename: string, gender: 'Male' | 'Female', offence?: string, subcode?: string }[] = [
    { forename: 'TestRef10', gender: 'Female' },                                // WIP L3V1 ISP
    { forename: 'TestRef11', gender: 'Male' },                                  // WIP L3V1 RSP
    { forename: 'TestRef14', gender: 'Male' },                                  // WIP L1V1
    { forename: 'TestRef15', gender: 'Male' },                                  // WIP L1V2
    { forename: 'TestRef19', gender: 'Male' },                                  // Completed L3V1 ISP
    { forename: 'TestRef20', gender: 'Female' },                                // Completed L3V1 RSP
    { forename: 'TestRef21', gender: 'Male' },                                  // Completed L1V1
    { forename: 'TestRef22', gender: 'Male', offence: '020', subcode: '01' },   // Completed L1V2
    { forename: 'TestRef23', gender: 'Male', },                                 // Completed L1V2
]

export const probSanOffenders: { forename: string, gender: 'Male' | 'Female', offence?: string, subcode?: string }[] = [
    { forename: 'Sixteen', gender: 'Male' },                                    // WIP L3V2
    { forename: 'TwentyFour', gender: 'Female', offence: '031', subcode: '00' },// Completed L3V2
]

export const prisonOffenders: { forename: string, gender: 'Male' | 'Female', offence?: string, subcode?: string }[] = [
    { forename: 'TestRef12', gender: 'Male' },                                  // WIP L3V1 ISP
    { forename: 'TestRef13', gender: 'Male' },                                  // WIP L3V1 RSP
    { forename: 'TestRef17', gender: 'Male', offence: '020', subcode: '02' },   // Completed L3V1 ISP
    { forename: 'TestRef18', gender: 'Male' },                                  // Completed L3V1 RSP
]

const baseSurname = 'StrTwo'
export const sets = 2

export function getSurname(set: number, sanMode: boolean = false) {
    return sanMode ? `${baseSurname}-Set${set == 1 ? 'One' : 'Two'}` : `${baseSurname}-Set${set}`
}