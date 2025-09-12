declare type SanStep = {
    item: string,
    value?: string,
}

declare type SanScript = {
    section: SanSection,
    scenarios: SanScenario[],
}

declare type SanScenario = {
    name: string,
    steps: SanStep[],
    oasysAnswers: OasysAnswer[],
}

declare type SanPopulation = { section: SanSection, steps: SanStep[] }[]

declare type SanIds = { [keys: string]: SanId }
declare type SanId = { type: 'radio' | 'checkbox' | 'textbox' | 'action' | 'date' | 'combo' | 'button' | 'select', id: string, options?: string[] }

declare type SanSection = 'Accommodation' | 'Employment and education' | 'Finances' | 'Drug use' | 'Alcohol use' | 'Health and wellbeing'
    | 'Personal relationships and community' | 'Thinking, behaviours and attitudes' | 'Offence analysis' | 'Sentence plan'