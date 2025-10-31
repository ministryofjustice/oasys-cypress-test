// import * as oasys from 'oasys'
// import { sets, getSurname } from '../parameters'

// describe('NOD1045 probation non-SAN completed assessments', () => {

//     it('Test ref 20', () => { // FEMALE Offender whose last assessment is a COMPLETED L3 V1 Review assessment with Review SP.

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef20')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
//             oasys.Populate.minimal({ layer: 'Layer 3' , sentencePlan: 'Review'})

//             const risk2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
//             risk2.r4_2.setValue('Yes')
//             risk2.r4_3.setValue('Yes')
//             oasys.Nav.clickButton('Save')

//             const risk9 = new oasys.Pages.Rosh.RoshFullAnalysisSection9().goto(true)
//             risk9.concernsControl.setValue('Yes')
//             risk9.concernsControlDetails.setValue('ConcernsControlDetails ' + oasys.oasysString(1500))
//             risk9.concernsControlPrevious.setValue('Yes')
//             risk9.concernsControlPreviousDetails.setValue('ConcernsControlPreviousDetails ' + oasys.oasysString(1500))
//             risk9.concernsTrust.setValue('Yes')
//             risk9.concernsTrustDetails.setValue('ConcernsTrustDetails ' + oasys.oasysString(1500))
//             risk9.concernsTrustPrevious.setValue('Yes')
//             risk9.concernsTrustPreviousDetails.setValue('ConcernsTrustPreviousDetails ' + oasys.oasysString(1500))

//             const roshSummary = new oasys.Pages.Rosh.RoshSummary().goto(true)
//             roshSummary.r10_1.setValue('R10.1 details ' + oasys.oasysString(1500))
//             roshSummary.r10_2.setValue('R10.2 details ' + oasys.oasysString(1500))
//             roshSummary.r10_3.setValue('R10.3 details ' + oasys.oasysString(1500))
//             roshSummary.r10_4.setValue('R10.4 details ' + oasys.oasysString(1500))
//             roshSummary.r10_5.setValue('R10.5 details ' + oasys.oasysString(1500))
//             roshSummary.r10_6ChildrenCommunity.setValue('Medium')
//             roshSummary.r10_6ChildrenCustody.setValue('Medium')
//             roshSummary.r10_6PublicCommunity.setValue('Medium')
//             roshSummary.r10_6PublicCustody.setValue('Medium')
//             roshSummary.r10_6AdultCommunity.setValue('Medium')
//             roshSummary.r10_6AdultCustody.setValue('Medium')
//             roshSummary.r10_6StaffCommunity.setValue('Medium')
//             roshSummary.r10_6StaffCustody.setValue('Medium')
//             roshSummary.r10_6PrisonersCustody.setValue('Medium')
//             roshSummary.details.setValue('Some details about documents and reports ' + oasys.oasysString(1500))
//             oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()

//             oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection1to2, expectRsrWarning: true })
//         }
//     })

// })
