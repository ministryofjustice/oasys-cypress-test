// import * as oasys from 'oasys'
// import { sets, getSurname } from '../parameters'

// describe('NOD1045 probation non-SAN completed assessments', () => {

//     it('Test ref 19', () => { // MALE Offender whose last assessment is a COMPLETED L3 V1 Start Community assessment with Initial SP.

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef19')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
//             oasys.Populate.minimal({ layer: 'Layer 3' })

//             const section3 = new oasys.Pages.Assessment.Section3().goto()
//             section3.o3_3.setValue('Yes')
//             section3.linkedToRisk.setValue('Yes')
//             oasys.Nav.clickButton('Save')   // to handle notification of changed scores

//             const risk1 = new oasys.Pages.Rosh.RoshScreeningSection1().goto()
//             risk1.r1_3_4.setValue('Yes')
//             risk1.r1_3_14.setValue('Yes')
//             risk1.r1_3_18.setValue('Yes')

//             const risk2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
//             risk2.r2_3.setValue('No')
//             risk2.rationale.setValue('Because')
//             risk2.r3_1.setValue('Yes')
//             risk2.r3_2.setValue('Yes')
//             risk2.r3_3.setValue('Yes')
//             risk2.r3_4.setValue('Yes')
//             risk2.r4_1.setValue('Yes')
//             risk2.r4_2.setValue('Yes')
//             risk2.r4_3.setValue('No')
//             risk2.r4_4.setValue('No')

//             const risk61 = new oasys.Pages.Rosh.RoshFullAnalysisSection61().goto(true)
//             risk61.what.setValue('6.1 What ' + oasys.oasysString(2500))
//             risk61.whereAndWhen.setValue('6.1 WhereAndWhen ' + oasys.oasysString(2500))
//             risk61.how.setValue('6.1 How ' + oasys.oasysString(2500))
//             risk61.victims.setValue('6.1 Victims ' + oasys.oasysString(2500))
//             risk61.anyoneElse.setValue('6.1 AnyoneElse ' + oasys.oasysString(2500))
//             risk61.why.setValue('6.1 Why ' + oasys.oasysString(2500))
//             risk61.sourcesOfInformation.setValue('6.1 SourcesOfInformation ' + oasys.oasysString(2500))

//             const risk62 = new oasys.Pages.Rosh.RoshFullAnalysisSection62().goto(true)
//             risk62.what.setValue('6.2  What ' + oasys.oasysString(2500))
//             risk62.whereAndWhen.setValue('6.2  WhereAndWhen ' + oasys.oasysString(2500))
//             risk62.how.setValue('6.2  How ' + oasys.oasysString(2500))
//             risk62.victims.setValue('6.2  Victims ' + oasys.oasysString(2500))
//             risk62.anyoneElse.setValue('6.2  AnyoneElse ' + oasys.oasysString(2500))
//             risk62.why.setValue('6.2  Why ' + oasys.oasysString(2500))
//             risk62.sourcesOfInformation.setValue('6.2 SourcesOfInformation ' + oasys.oasysString(2500))

//             const risk8 = new oasys.Pages.Rosh.RoshFullAnalysisSection8().goto(true)
//             risk8.concernsSuicide.setValue('Yes')
//             risk8.concernsSelfHarm.setValue('Yes')
//             risk8.suicideHarmDetails.setValue('SuicideHarmDetails ' + oasys.oasysString(2500))
//             risk8.bookNumber.setValue('BookNumber')
//             risk8.concernsSuicidePast.setValue('Yes')
//             risk8.concernsSelfHarmPast.setValue('Yes')
//             risk8.suicideHarmDetailsPast.setValue('SuicideHarmDetailsPast ' + oasys.oasysString(2500))
//             risk8.concernsCustody.setValue('Yes')
//             risk8.concernsHostel.setValue('Yes')
//             risk8.custodyHostelDetails.setValue('CustodyHostelDetails ' + oasys.oasysString(2500))
//             risk8.concernsCustodyPrevious.setValue('Yes')
//             risk8.concernsHostelPrevious.setValue('Yes')
//             risk8.custodyHostelDetailsPrevious.setValue('CustodyHostelDetailsPrevious ' + oasys.oasysString(2500))
//             risk8.concernsVulnerability.setValue('Yes')
//             risk8.vulnerabilityDetails.setValue('VulnerabilityDetails ' + oasys.oasysString(2500))
//             risk8.concernsVulnerabilityPrevious.setValue('Yes')
//             risk8.vulnerabilityDetailsPrevious.setValue('VulnerabilityDetailsPrevious ' + oasys.oasysString(2500))
//             risk8.roshOthers.setValue('Yes')
//             risk8.riskDetails.setValue('RiskDetails ' + oasys.oasysString(2500))

//             const risk9 = new oasys.Pages.Rosh.RoshFullAnalysisSection9().goto(true)
//             risk9.concernsEscape.setValue('Yes')
//             risk9.concernsEscapeDetails.setValue('ConcernsEscapeDetails ' + oasys.oasysString(2500))
//             risk9.concernsEscapePrevious.setValue('Yes')
//             risk9.concernsEscapePreviousDetails.setValue('ConcernsEscapePreviousDetails ' + oasys.oasysString(2500))
//             risk9.concernsControl.setValue('Yes')
//             risk9.concernsControlDetails.setValue('ConcernsControlDetails ' + oasys.oasysString(2500))
//             risk9.concernsControlPrevious.setValue('Yes')
//             risk9.concernsControlPreviousDetails.setValue('ConcernsControlPreviousDetails ' + oasys.oasysString(2500))

//             const roshSummary = new oasys.Pages.Rosh.RoshSummary().goto(true)
//             roshSummary.r10_1.setValue('R10.1 details ' + oasys.oasysString(2500))
//             roshSummary.r10_2.setValue('R10.2 details ' + oasys.oasysString(2500))
//             roshSummary.r10_3.setValue('R10.3 details ' + oasys.oasysString(2500))
//             roshSummary.r10_4.setValue('R10.4 details ' + oasys.oasysString(2500))
//             roshSummary.r10_5.setValue('R10.5 details ' + oasys.oasysString(2500))
//             roshSummary.r10_6ChildrenCommunity.setValue('Medium')
//             roshSummary.r10_6ChildrenCustody.setValue('Medium')
//             roshSummary.r10_6PublicCommunity.setValue('Medium')
//             roshSummary.r10_6PublicCustody.setValue('Medium')
//             roshSummary.r10_6AdultCommunity.setValue('Medium')
//             roshSummary.r10_6AdultCustody.setValue('Medium')
//             roshSummary.r10_6StaffCommunity.setValue('Medium')
//             roshSummary.r10_6StaffCustody.setValue('Medium')
//             roshSummary.r10_6PrisonersCustody.setValue('Medium')
//             roshSummary.details.setValue('Some details about documents and reports ' + oasys.oasysString(2500))

//             oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()
//             risk2.goto().r2_3.setValue('No')

//             oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.IspSection1to4, expectRsrWarning: true })
//         }
//     })

// })
