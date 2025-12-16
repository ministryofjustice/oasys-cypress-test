export const modifySan: SanPopulation = [
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
]
