// import * as oasys from 'oasys'
// import { sets, getSurname } from '../parameters'

// describe('NOD1045 prison non-SAN completed assessments', () => {

//     it('Test ref 18', () => { // MALE Offender whose last assessment is a COMPLETED L3 V1 Review with Review SP

//         oasys.login(oasys.Users.prisHomds)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef18')
//             oasys.Assessment.createPris({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Review' })

//             oasys.Populate.CommonPages.OffendingInformation.minimal()

//             const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
//             predictors.dateFirstSanction.setValue({ years: -3 })
//             predictors.o1_32.setValue(2)
//             predictors.o1_40.setValue(0)
//             predictors.o1_29.setValue({ months: -6 })
//             predictors.o1_30.setValue('No')
//             predictors.o1_38.setValue({ months: -1 })

//             oasys.Populate.sections2To13NoIssues()
//             oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

//             new oasys.Pages.Assessment.Section7().goto().linkedToRisk.setValue('Yes')

//             oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
//             new oasys.Pages.Rosh.RoshScreeningSection1().r1_2_16P.setValue('Yes')

//             const risk2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
//             risk2.r2_3.setValue('No')
//             risk2.r3_1.setValue('No')
//             risk2.r3_2.setValue('No')
//             risk2.r3_3.setValue('No')
//             risk2.r3_4.setValue('No')
//             risk2.r4_1.setValue('No')
//             risk2.r4_2.setValue(`Don't Know`)
//             risk2.r4_3.setValue('No')
//             risk2.r4_4.setValue('No')

//             const risk61 = new oasys.Pages.Rosh.RoshFullAnalysisSection61().goto(true)
//             risk61.what.setValue('6.1 What')
//             risk61.whereAndWhen.setValue('6.1 WhereAndWhen')
//             risk61.how.setValue('6.1 How')
//             risk61.victims.setValue('6.1 Victims')
//             risk61.anyoneElse.setValue('6.1 AnyoneElse')
//             risk61.why.setValue('6.1 Why')
//             risk61.sourcesOfInformation.setValue('6.1 SourcesOfInformation')

//             const risk62 = new oasys.Pages.Rosh.RoshFullAnalysisSection62().goto(true)
//             risk62.what.setValue('6.2  What')
//             risk62.whereAndWhen.setValue('6.2  WhereAndWhen')
//             risk62.how.setValue('6.2  How')
//             risk62.victims.setValue('6.2  Victims')
//             risk62.anyoneElse.setValue('6.2  AnyoneElse')
//             risk62.why.setValue('6.2  Why')
//             risk62.sourcesOfInformation.setValue('6.2 SourcesOfInformation')

//             const roshSummary = new oasys.Pages.Rosh.RoshSummary().goto(true)
//             roshSummary.r10_1.setValue('R10.1 details ' + oasys.oasysString(986))
//             roshSummary.r10_2.setValue('R10.2 details ' + oasys.oasysString(986))
//             roshSummary.r10_3.setValue('R10.3 details ' + oasys.oasysString(986))
//             roshSummary.r10_4.setValue('R10.4 details ' + oasys.oasysString(986))
//             roshSummary.r10_5.setValue('R10.5 details ' + oasys.oasysString(986))
//             roshSummary.r10_6ChildrenCommunity.setValue('Medium')
//             roshSummary.r10_6ChildrenCustody.setValue('Medium')
//             roshSummary.r10_6PublicCommunity.setValue('Medium')
//             roshSummary.r10_6PublicCustody.setValue('Medium')
//             roshSummary.r10_6AdultCommunity.setValue('Medium')
//             roshSummary.r10_6AdultCustody.setValue('Medium')
//             roshSummary.r10_6StaffCommunity.setValue('Medium')
//             roshSummary.r10_6StaffCustody.setValue('Medium')
//             roshSummary.r10_6PrisonersCustody.setValue('Medium')
//             roshSummary.details.setValue('Some details about documents and reports ' + oasys.oasysString(2959))

//             oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields(true)

//             oasys.Populate.SentencePlanPages.RspSection72to10.minimal()
//             oasys.Assessment.signAndLock()
//         }
//     })

// })
