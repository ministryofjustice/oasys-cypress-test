export const script: SanScript = {
    section: 'Offence analysis',
    scenarios: [
        {
            name: '1 - ',
            steps: [
                { item: 'offenceDescription', value: `''""=-` },
                { item: 'offenceElements', value: `arson` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `addictions` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '2', q: '2.1', a: `''""=-` },
            ],
        },
        {
            name: '2 - ',
            steps: [
                { item: 'back' },
                { item: 'offenceDescription', value: '`' },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '2', q: '2.1', a: `'` },
            ],
        },
        {
            name: '3 - ',
            steps: [
                { item: 'back' },
                { item: 'offenceDescription', value: `%&#– “” ‘’` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '2', q: '2.1', a: `%&#- "" ''` },
            ],
        },
        {
            name: '4 - ',
            steps: [
                { item: 'back' },
                { item: 'offenceDescription', value: `\\/<>	` },
                { item: 'saveAndContinue' },
            ],
            oasysAnswers: [
                { section: '2', q: '2.1', a: `\\/<>` },  // NOTE Tab is not returned
            ],
        },
    ]
}

