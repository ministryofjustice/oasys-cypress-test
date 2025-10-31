// import * as oasys from 'oasys'
// import { sets, getSurname } from '../parameters'

// describe('NOD1045 probation non-SAN completed assessments', () => {

//     it('Test ref 22', () => { // MALE Offender whose last assessment is a COMPLETED ROSHA L1 V2 assessment.

//         oasys.login(oasys.Users.probHeadPdu)

//         for (let set = 1; set <= sets; set++) {

//             oasys.Offender.searchAndSelectByName(getSurname(set), 'TestRef22')
//             oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

//             const predictors = new oasys.Pages.Assessment.RoshaPredictors()
//             predictors.goto(true)
//             predictors.dateFirstSanction.setValue({ years: -2 })
//             predictors.o1_32.setValue('5')
//             predictors.o1_40.setValue('1')
//             predictors.o1_29.setValue({ weeks: -1 })
//             predictors.o1_44.setValue('Yes')
//             predictors.o1_33.setValue({ years: -5 })
//             predictors.o1_34.setValue('0')
//             predictors.o1_45.setValue('0')
//             predictors.o1_46.setValue('0')
//             predictors.o1_37.setValue('2')
//             predictors.o1_38.setValue({ months: 18 })
//             predictors.o1_39.setValue('Yes')
//             predictors.o2_2.setValue('No')
//             predictors.o3_4.setValue('1-Some problems')
//             predictors.o4_2.setValue('2-Yes')
//             predictors.o6_4.setValue('2-Significant problems')
//             predictors.o6_7.setValue('No')
//             predictors.o9_1.setValue('1-Some problems')
//             predictors.o9_2.setValue('0-No problems')
//             predictors.o11_2.setValue('0-No problems')
//             predictors.o11_4.setValue('1-Some problems')
//             predictors.o12_1.setValue('1-Some problems')

//             oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
//             new oasys.Pages.Rosh.RoshScreeningSection1().r1_2_4C.setValue('Yes')
//             oasys.Populate.RoshPages.RoshScreeningSection2to4.noRisks(true)
//             new oasys.Pages.Rosh.RoshScreeningSection2to4().r4_3.setValue(`Don't Know`)

//             const risk61 = new oasys.Pages.Rosh.RoshFullAnalysisSection61().goto(true)
//             risk61.what.setValue('6.1 What ' + oasys.oasysString(491))
//             risk61.whereAndWhen.setValue('6.1 WhereAndWhen ' + oasys.oasysString(483))
//             risk61.how.setValue('6.1 How ' + oasys.oasysString(492))
//             risk61.victims.setValue('6.1 Victims ' + oasys.oasysString(488))
//             risk61.anyoneElse.setValue('6.1 AnyoneElse ' + oasys.oasysString(485))
//             risk61.why.setValue('6.1 Why ' + oasys.oasysString(492))
//             risk61.sourcesOfInformation.setValue('6.1 SourcesOfInformation ' + oasys.oasysString(475))

//             const risk62 = new oasys.Pages.Rosh.RoshFullAnalysisSection62().goto(true)
//             risk62.what.setValue('6.2  What ' + oasys.oasysString(491))
//             risk62.whereAndWhen.setValue('6.2  WhereAndWhen ' + oasys.oasysString(483))
//             risk62.how.setValue('6.2  How ' + oasys.oasysString(492))
//             risk62.victims.setValue('6.2  Victims ' + oasys.oasysString(488))
//             risk62.anyoneElse.setValue('6.2  AnyoneElse ' + oasys.oasysString(485))
//             risk62.why.setValue('6.2  Why ' + oasys.oasysString(492))
//             risk62.sourcesOfInformation.setValue('6.2 SourcesOfInformation ' + oasys.oasysString(475))

//             oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('High')
//             oasys.Populate.RoshPages.RiskManagementPlan.minimal()

//             oasys.Assessment.signAndLock({ expectRsrScore: true })
//         }
//     })

// })
