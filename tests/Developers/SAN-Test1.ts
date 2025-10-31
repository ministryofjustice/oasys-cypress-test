import { createProb } from 'lib/assessment';

import { sanPopulation } from './testRef17';  // Import modified SAN pop script

import * as oasys from 'oasys'

describe('TEST SCRIPT DESCRIPTION HERE', () => {
//hello
    it('SCENARIO DESCRIPTION HERE', () => {

            oasys.login('RBACKENT', 'Pa55word1', 'PS Kent');

            oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'myOffender');
            //  *  - purposeOfAssessment: PurposeOfAssessment
            //  *  - otherPleaseSpecify?: string
            //  *  - assessmentLayer?: AssessmentLayer
            //  *  - sentencePlanType?: string
            //  *  - includeCourtReportTemplate?: string
            //  *  - includeSanSections?: YesNoAnswer
            //  *  - selectTeam?: string
            //  *  - selectAssessor?: string
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes'});

            oasys.San.gotoSan();

            //oasys.San.populateSanSections('Carls SAN', oasys.Populate.San.ExampleTest.sanPopulation1 ); // From core minimal setup

            oasys.San.populateSanSections('Carls SAN', sanPopulation ); // From modified SAN pop script

            oasys.San.returnToOASys();

            oasys.San.gotoSentencePlan();

            oasys.San.populateSanSections('Carls SP', oasys.Populate.San.SentencePlan.minimal);

            oasys.San.returnToOASys();
    })
})