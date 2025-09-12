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
