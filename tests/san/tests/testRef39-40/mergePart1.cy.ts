import * as oasys from 'oasys'
import * as testData from '../../data/mergeTest'

describe('SAN integration - tests 39/40', () => {
    /**
     * Merge - where BOTH offenders have OASys-SAN assessments
     * Merge two offenders where BOTH of the offenders have OASys-SAN assessments - check it posts the correct MERGE API
     * 
     * De-merge - where BOTH offenders have OASys-SAN assessments
     * Using the offender who was previously merged in this situation, create and complete a new OASys-SAN assessment.
     * The carry out a De-merge - check it posts the correct MERGE API
     */

    it('Merge tests part 1 - create and complete 3.2 assessment on offender 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)  // Senior user so no countersigning for this test
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            // Create assessment
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            // Complete section 1
            const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
            offendingInformation.offence.setValue('030')
            offendingInformation.subcode.setValue('01')
            offendingInformation.count.setValue(1)
            offendingInformation.offenceDate.setValue({ months: -6 })
            offendingInformation.sentence.setValue('Fine')
            offendingInformation.sentenceDate.setValue({ months: -1 })

            const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
            predictors.dateFirstSanction.setValue({ years: -2 })
            predictors.o1_32.setValue(2)
            predictors.o1_40.setValue(0)
            predictors.o1_29.setValue({ months: -1 })
            predictors.o1_30.setValue('No')
            predictors.o1_38.setValue({})

            oasys.San.gotoSan()
            oasys.San.populateSanSections('Merge test', testData.sanPopulation)
            oasys.San.returnToOASys()

            oasys.Populate.Rosh.screeningNoRisks(true)

            // Sign and lock
            // Complete SP, then sign and lock
            oasys.San.gotoSentencePlan()
            oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
            oasys.San.returnToOASys()

            new oasys.Pages.SentencePlan.IspSection52to8().goto()
            oasys.Assessment.signAndLock()
            oasys.logout()
        })
    })
})
