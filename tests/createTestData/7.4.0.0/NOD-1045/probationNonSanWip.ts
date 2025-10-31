// import * as oasys from 'oasys'
// import { sets, getSurname } from './parameters'

// describe('NOD1045 probation non-SAN WIP assessments', () => {

//     it('Test ref 10', () => { // FEMALE Offender with a WIP L3 V1 Start Community assessment with Initial SP

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef10')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
//             oasys.Populate.CommonPages.OffendingInformation.minimal()
//             oasys.Populate.Layer3Pages.Predictors.minimal()

//             const section2 = new oasys.Pages.Assessment.Section2().goto()
//             section2.o2_2Weapon.setValue('Yes')
//             section2.o2_2Arson.setValue('Yes')
//             section2.o2_2Violence.setValue('Yes')
//             section2.o2_9Emotional.setValue('Yes')
//             section2.linkedToRisk.setValue('Yes')

//             new oasys.Pages.Assessment.Section6().goto().o6_3.setValue('2-Significant problems')

//             const section10 = new oasys.Pages.Assessment.Section10().goto()
//             section10.o10_1.setValue('1-Some problems')
//             section10.o10_2.setValue('1-Some problems')
//             section10.o10_5.setValue('Yes - 2')
//             section10.linkedToRisk.setValue('Yes')

//             const risk1 = new oasys.Pages.Rosh.RoshScreeningSection1().goto()
//             risk1.r1_2_7C.setValue('Yes')
//             risk1.r1_2_13C.setValue('Yes')

//             oasys.Nav.clickButton('Save')
//             oasys.Nav.clickButton('Close')

//         }
//     })


//     it('Test ref 11', () => { // MALE Offender with a WIP L3 V1 Review assessment with Review SP.

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef11')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'Review' })
//             oasys.Populate.CommonPages.OffendingInformation.minimal()
//             oasys.Populate.Layer3Pages.Predictors.minimal()

//             const section2 = new oasys.Pages.Assessment.Section2().goto()
//             section2.o2_2Weapon.setValue('No')
//             section2.o2_2Violence.setValue('No')

//             const risk1 = new oasys.Pages.Rosh.RoshScreeningSection1().goto()
//             risk1.mark1_2AsNo.click()
//             risk1.r1_2_5C.setValue('Yes')
//             risk1.mark1_3AsNo.click()
//             risk1.r1_3_18.setValue('Yes')
//             risk1.r1_4.setValue('No')

//             const risk2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
//             risk2.r2_3.setValue('Yes')
//             risk2.r2_4_1.setValue('Yes')
//             risk2.r2_4_2.setValue('No')

//             oasys.Nav.clickButton('Save')
//             oasys.Nav.clickButton('Close')

//         }
//     })


//     it('Test ref 14', () => { // MALE Offender with a WIP L1 V1 assessment with Basic SP.

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef14')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
//             oasys.Populate.minimal({ layer: 'Layer 1' })
//         }
//     })


//     it('Test ref 15', () => { // MALE Offender with a WIP ROSHA L1 V2 assessment.

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef15')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
//             oasys.Populate.minimal({ layer: 'Layer 1V2' })
//         }
//     })


// })
