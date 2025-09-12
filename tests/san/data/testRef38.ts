export const modifySan: SanPopulation = [
    {
        section: 'Accommodation',
        steps: [
            { item: 'practitionerAnalysis' },
            { item: 'change' },
            { item: 'accommodationRiskSeriousHarm', value: 'yes' },
            { item: 'accommodationRiskSeriousHarmYesDetails', value: 'Accommodation serious harm details' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Thinking, behaviours and attitudes',
        steps: [
            { item: 'practitionerAnalysis' },
            { item: 'change' },
            { item: 'thinkingRiskSeriousHarm', value: 'yes' },
            { item: 'thinkingRiskSeriousHarmYesDetails', value: 'TBA serious harm details' },
            { item: 'markAsComplete' },
        ],
    },
]

export const modifySan2: SanPopulation = [
    {
        section: 'Accommodation',
        steps: [
            { item: 'change' },
            { item: 'currentAccommodation', value: 'temporary' },
            { item: 'temporaryAccommodationType', value: 'approvedPremises' },
            { item: 'saveAndContinue' },
            { item: 'accommodationSuitable', value: 'yesWithConcerns' },
            { item: 'futurePlanned', value: 'yes' },
            { item: 'futureType', value: 'privateRent' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Employment and education',
        steps: [
            { item: 'change' },
            { item: 'employmentStatus', value: 'retired' },
            { item: 'saveAndContinue' },
            { item: 'employmentHistory', value: 'continuous' },
            { item: 'additionalCommitments', value: 'volunteering' },
            { item: 'highestQual', value: 'level1' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Finances',
        steps: [
            { item: 'change' },
            { item: 'incomeSource', value: 'offending,pension' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Alcohol use',
        steps: [
            { item: 'change' },
            { item: 'everDrank', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Health and wellbeing',
        steps: [
            { item: 'change' },
            { item: 'mentalHealthProblems', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Personal relationships and community',
        steps: [
            { item: 'change' },
            { item: 'saveAndContinue' },
            { item: 'saveAndContinue' },
            { item: 'happyWithStatus', value: 'unhappy' },
            { item: 'history', value: 'stable' },
            { item: 'saveAndContinue' },
            { item: 'practitionerAnalysis' },
            { item: 'markAsComplete' },
        ],
    },
    {
        section: 'Offence analysis',
        steps: [
            { item: 'change' },
            { item: 'offenceDescription', value: 'Offence analysis details edited' },
            { item: 'offenceElements', value: 'excessiveViolence, domesticAbuse' },
            { item: 'reason', value: 'Reasons for commiting the offence edited' },
            { item: 'victimTypeDetails', value: 'Details about the victims edited' },
            { item: 'saveAndContinue' },
            { item: 'saveAndContinue' },
            { item: 'patterns', value: 'Patterns of offending edited' },
            { item: 'markAsComplete' },
        ],
    },
]