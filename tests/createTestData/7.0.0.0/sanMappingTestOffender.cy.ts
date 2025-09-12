import * as oasys from 'oasys'

const initialOffenderDetails: OffenderDef = {

    forename1: 'MappingTest',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN mapping tests', () => {

    it('Create offender for SAN mapping tests', () => {

        oasys.login(oasys.Users.probSanUnappr)
        oasys.Offender.createProb(initialOffenderDetails, `mappingTests`)

        oasys.logout()
    })
})
