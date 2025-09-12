export const sanPopulation: SanPopulation = [
    {
        section: 'Accommodation',
        steps: [
            { item: 'currentAccommodation', value: 'noAccommodation' },
        ],
    },
    {
        section: 'Employment and education',
        steps: [
            { item: 'employmentStatus', value: 'selfEmployed' },
            { item: 'saveAndContinue' },
            { item: 'highestQual', value: 'entryLevel' },
            { item: 'skills', value: 'no' },
            { item: 'difficulties', value: `reading, numeracy` },
            { item: 'readingLevel', value: `some` },
            { item: 'numeracyLevel', value: `some` },
        ],
    },
    {
        section: 'Finances',
        steps: [
            { item: 'incomeSource', value: 'family' },
            { item: 'overReliant', value: `yes` },
        ],
    },
    {
        section: 'Health and wellbeing',
        steps: [
            { item: 'physicalHealthConditions', value: 'no' },
            { item: 'mentalHealthProblems', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'learningDifficulties', value: 'yesSome' },
        ],
    },
    {
        section: 'Personal relationships and community',
        steps: [
            { item: 'anyChildren', value: 'no' },
            { item: 'saveAndContinue' },
            { item: 'importantPeople', value: 'partner' },
            { item: 'saveAndContinue' },
            { item: 'behaviouralProblems', value: 'yes' },
        ],
    },
    {
        section: 'Thinking, behaviours and attitudes',
        steps: [
            { item: 'awareConsequences', value: 'yes' },
            { item: 'stableBehaviour', value: 'sometimes' },
            { item: 'activitiesLinkedOffending', value: 'proSocialActivities' },
            { item: 'resilient', value: 'yes' },
            { item: 'ableSolveProblems', value: 'yes' },
            { item: 'understandOthers', value: 'no' },
            { item: 'manipulativeBehaviour', value: 'some' },
            { item: 'saveAndContinue' },
            { item: 'sexualPreoccupation', value: `unknown` },
            { item: 'sexualInterests', value: `no` },
            { item: 'emotionalIntimacy', value: `sometimes` },
            { item: 'saveAndContinue' },
            { item: 'violence', value: 'sometimes' },
            { item: 'impulse', value: 'sometimes' },
        ],
    },
    {
        section: 'Offence analysis',
        steps: [
            { item: 'offenceDescription', value: `Offence description` },
            { item: 'offenceElements', value: `violence, excessiveViolence` },
            { item: 'reason', value: `Why it happened` },
            { item: 'motivations', value: `other` },
            { item: 'motivationOther', value: `Some reason` },
            { item: 'victimType', value: `other` },
            { item: 'victimTypeDetails', value: `Victim details` },
            { item: 'saveAndContinue' },
            { item: 'howManyOthers', value: `0` },
            { item: 'saveAndContinue' },
            { item: 'impact', value: `no` },
        ],
    },
]
