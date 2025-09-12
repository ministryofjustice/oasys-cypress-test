import * as oasys from 'oasys'

describe('Example test - create a prison offender and a layer 1 assessment', () => {

    it('Create offender and assessment', () => {
        oasys.login(oasys.Users.prisHomds)

        oasys.Offender.createPris(oasys.OffenderLib.Prison.Male.burglary, 'offender1')
        oasys.Assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Basic (Layer 1)' })

        // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
        oasys.Populate.minimal({ layer: 'Layer 1', provider: 'pris' })
        // oasys.Populate.fullyPopulated({ layer: 'Layer 1', provider: 'pris', maxStrings: true })

        oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.BasicSentencePlan })

        oasys.logout()
    })

})
