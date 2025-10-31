export const script: SanScript = {
    section: 'Drug use',
    scenarios: [
        {
            name: 'A1 - Strength',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'motivatedToStop', value: `motivated` },
                { item: 'drugsStrengths', value: `yes` },
                { item: 'drugsStrengthsYesDetails', value: `There are some strengths` },
                { item: 'drugsRiskSeriousHarm', value: `no` },
                { item: 'drugsRiskSeriousHarmNoDetails', value: `No risk of serious harm` },
                { item: 'drugsRiskReoffending', value: `no` },
                { item: 'drugsRiskReoffendingNoDetails', value: `No risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.8', a: `0` },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: `Strengths and protective factor notes - There are some strengths
Area not linked to serious harm notes - No risk of serious harm
Area not linked to reoffending notes - No risk of reoffending` },
                { section: '8', q: '8.98', a: `NO` },
                { section: '8', q: '8.99', a: `NO` },
                { section: '8', q: '8_SAN_STRENGTH', a: `YES` },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A2 - Risk of harm',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'motivatedToStop', value: `someMotivation` },
                { item: 'drugsStrengths', value: `no` },
                { item: 'drugsStrengthsNoDetails', value: `There are no strengths` },
                { item: 'drugsRiskSeriousHarm', value: `yes` },
                { item: 'drugsRiskSeriousHarmYesDetails', value: `There is a risk of serious harm` },
                { item: 'drugsRiskReoffending', value: `no` },
                { item: 'drugsRiskReoffendingNoDetails', value: `No risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.8', a: `1` },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: `Area not linked to strengths and positive factors notes - There are no strengths
Area linked to serious harm notes - There is a risk of serious harm
Area not linked to reoffending notes - No risk of reoffending` },
                { section: '8', q: '8.98', a: `YES` },
                { section: '8', q: '8.99', a: `NO` },
                { section: '8', q: '8_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A3 - Risk of reoffending',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'motivatedToStop', value: `noMotivation` },
                { item: 'drugsStrengths', value: `no` },
                { item: 'drugsStrengthsNoDetails', value: `There are no strengths` },
                { item: 'drugsRiskSeriousHarm', value: `no` },
                { item: 'drugsRiskSeriousHarmNoDetails', value: `No risk of serious harm` },
                { item: 'drugsRiskReoffending', value: `yes` },
                { item: 'drugsRiskReoffendingYesDetails', value: `High risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.8', a: `2` },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: `Area not linked to strengths and positive factors notes - There are no strengths
Area not linked to serious harm notes - No risk of serious harm
Risk of reoffending notes - High risk of reoffending` },
                { section: '8', q: '8.98', a: `NO` },
                { section: '8', q: '8.99', a: `YES` },
                { section: '8', q: '8_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A4 - None',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'motivatedToStop', value: `unknown` },
                { item: 'drugsStrengths', value: `no` },
                { item: 'drugsStrengthsNoDetails', value: `There are no strengths` },
                { item: 'drugsRiskSeriousHarm', value: `no` },
                { item: 'drugsRiskSeriousHarmNoDetails', value: `No risk of serious harm` },
                { item: 'drugsRiskReoffending', value: `no` },
                { item: 'drugsRiskReoffendingNoDetails', value: `No risk of reoffending` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.8', a: null },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: `Area not linked to strengths and positive factors notes - There are no strengths
Area not linked to serious harm notes - No risk of serious harm
Area not linked to reoffending notes - No risk of reoffending` },
                { section: '8', q: '8.98', a: `NO` },
                { section: '8', q: '8.99', a: `NO` },
                { section: '8', q: '8_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A5 - All, max length',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'motivatedToStop', value: `motivated` },
                { item: 'drugsStrengths', value: `yes` },
                { item: 'drugsStrengthsYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC` },
                { item: 'drugsRiskSeriousHarm', value: `yes` },
                { item: 'drugsRiskSeriousHarmYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC` },
                { item: 'drugsRiskReoffending', value: `yes` },
                { item: 'drugsRiskReoffendingYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.8', a: `0` },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: `Strengths and protective factor notes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC
Area linked to serious harm notes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABC
Risk of reoffending notes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '8', q: '8.98', a: `YES` },
                { section: '8', q: '8.99', a: `YES` },
                { section: '8', q: '8_SAN_STRENGTH', a: `YES` },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A6 - No, empty strings',
            steps: [
                { item: 'practitionerAnalysis' },
                { item: 'changeAnalysis' },
                { item: 'motivatedToStop', value: `unknown` },
                { item: 'drugsStrengths', value: `no` },
                { item: 'drugsStrengthsNoDetails', value: `` },
                { item: 'drugsRiskSeriousHarm', value: `no` },
                { item: 'drugsRiskSeriousHarmNoDetails', value: `` },
                { item: 'drugsRiskReoffending', value: `no` },
                { item: 'drugsRiskReoffendingNoDetails', value: `` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.8', a: null },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: null },
                { section: '8', q: '8.98', a: `NO` },
                { section: '8', q: '8.99', a: `NO` },
                { section: '8', q: '8_SAN_STRENGTH', a: `NO` },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: 'A7 - Completed Section',
            steps: [
                { item: 'backIfVisible' },
                { item: 'backIfVisible' },
                { item: 'backIfVisible' },
                { item: 'backIfVisible' },
                { item: 'everUsed', value: `no` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '8', q: '8.1', a: `NO` },
                { section: '8', q: '8.2.8.1', a: null },
                { section: '8', q: '8.2.8.2', a: null },
                { section: '8', q: '8.2.8.3', a: null },
                { section: '8', q: '8.2.8.4', a: null },
                { section: '8', q: '8.2.7.1', a: null },
                { section: '8', q: '8.2.7.2', a: null },
                { section: '8', q: '8.2.7.3', a: null },
                { section: '8', q: '8.2.7.4', a: null },
                { section: '8', q: '8.2.11.1', a: null },
                { section: '8', q: '8.2.11.3', a: null },
                { section: '8', q: '8.2.5.1', a: null },
                { section: '8', q: '8.2.5.2', a: null },
                { section: '8', q: '8.2.5.3', a: null },
                { section: '8', q: '8.2.5.4', a: null },
                { section: '8', q: '8.2.4.1', a: null },
                { section: '8', q: '8.2.4.2', a: null },
                { section: '8', q: '8.2.4.3', a: null },
                { section: '8', q: '8.2.4.4', a: null },
                { section: '8', q: '8.2.10.1', a: null },
                { section: '8', q: '8.2.10.3', a: null },
                { section: '8', q: '8.2.9.1', a: null },
                { section: '8', q: '8.2.9.3', a: null },
                { section: '8', q: '8.2.1.1', a: null },
                { section: '8', q: '8.2.1.2', a: null },
                { section: '8', q: '8.2.1.3', a: null },
                { section: '8', q: '8.2.1.4', a: null },
                { section: '8', q: '8.2.2.1', a: null },
                { section: '8', q: '8.2.2.2', a: null },
                { section: '8', q: '8.2.2.3', a: null },
                { section: '8', q: '8.2.2.4', a: null },
                { section: '8', q: '8.2.6.1', a: null },
                { section: '8', q: '8.2.6.2', a: null },
                { section: '8', q: '8.2.6.3', a: null },
                { section: '8', q: '8.2.6.4', a: null },
                { section: '8', q: '8.2.3.1', a: null },
                { section: '8', q: '8.2.3.2', a: null },
                { section: '8', q: '8.2.3.3', a: null },
                { section: '8', q: '8.2.3.4', a: null },
                { section: '8', q: '8.2.12.1', a: null },
                { section: '8', q: '8.2.12.3', a: null },
                { section: '8', q: '8.2.13.1', a: null },
                { section: '8', q: '8.2.13.2', a: null },
                { section: '8', q: '8.2.13.3', a: null },
                { section: '8', q: '8.2.13.4', a: null },
                { section: '8', q: '8.2.15.1', a: null },
                { section: '8', q: '8.2.15.3', a: null },
                { section: '8', q: '8.2.14.1', a: null },
                { section: '8', q: '8.2.14.2', a: null },
                { section: '8', q: '8.2.14.3', a: null },
                { section: '8', q: '8.2.14.4', a: null },
                { section: '8', q: '8.2.14.t', a: null },
                { section: '8', q: '8.4', a: `0` },
                { section: '8', q: '8.5', a: `0` },
                { section: '8', q: '8.6', a: `0` },
                { section: '8', q: '8.8', a: null },
                { section: '8', q: '8.9', a: null },
                { section: '8', q: '8.97', a: null },
                { section: '8', q: '8.98', a: null },
                { section: '8', q: '8.99', a: null },
                { section: '8', q: '8_SAN_STRENGTH', a: null },
                { section: 'SAN', q: 'SMD_SAN_SECTION_COMP', a: `NO` },
            ],
        },
    ]
}

