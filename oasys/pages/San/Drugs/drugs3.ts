import * as SanElement from 'classes/san/sanElements'
import { BaseSanEditPage } from '../baseSanEditPage'

export class Drugs3 extends BaseSanEditPage {

    name = 'Drugs3'
    title = 'Drug usage - Strengths and Needs'

    amphetaminesFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_amphetamines', ['daily', 'weekly', 'monthly', 'occasionally'])
    benzodiazepinesFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_benzodiazepines', ['daily', 'weekly', 'monthly', 'occasionally'])
    cannabisFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_cannabis', ['daily', 'weekly', 'monthly', 'occasionally'])
    cocaineFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_cocaine', ['daily', 'weekly', 'monthly', 'occasionally'])
    crackFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_crack', ['daily', 'weekly', 'monthly', 'occasionally'])
    ecstasyFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_ecstasy', ['daily', 'weekly', 'monthly', 'occasionally'])
    hallucinogenicsFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_hallucinogenics', ['daily', 'weekly', 'monthly', 'occasionally'])
    heroinFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_heroin', ['daily', 'weekly', 'monthly', 'occasionally'])
    methadoneFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_methadone', ['daily', 'weekly', 'monthly', 'occasionally'])
    prescribedFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_prescribed', ['daily', 'weekly', 'monthly', 'occasionally'])
    opiatesFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_other_opiates', ['daily', 'weekly', 'monthly', 'occasionally'])
    solventsFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_solvents', ['daily', 'weekly', 'monthly', 'occasionally'])
    steroidsFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_steroids', ['daily', 'weekly', 'monthly', 'occasionally'])
    spiceFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_spice', ['daily', 'weekly', 'monthly', 'occasionally'])
    otherFrequency = new SanElement.Radiogroup<'daily' | 'weekly' | 'monthly' | 'occasionally'>('#how_often_used_last_six_months_other_drug', ['daily', 'weekly', 'monthly', 'occasionally'])

    detailsNotLastSixMonths = new SanElement.Textbox('#not_used_in_last_six_months_details')
    injected = new SanElement.CheckboxGroup<'none' | 'amphetamines' | 'benzodiazepines' | 'cocaine' | 'crack' | 'heroin' | 'methadone' | 'prescribed' | 'opiates' | 'steroids' | 'other'>('#drugs_injected', ['none', '-', 'amphetamines', 'benzodiazepines', 'cocaine', 'crack', 'heroin', 'methadone', 'prescribed', 'opiates', 'steroids', 'other'], true)

    amphetaminesInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_amphetamines', ['lastSix', 'moreThanSix'])
    benzodiazepinesInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_benzodiazepines', ['lastSix', 'moreThanSix'])
    cocaineInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_cocaine', ['lastSix', 'moreThanSix'])
    crackInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_crack', ['lastSix', 'moreThanSix'])
    heroinInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_heroin', ['lastSix', 'moreThanSix'])
    methadoneInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_methadone', ['lastSix', 'moreThanSix'])
    prescribedInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_prescribed', ['lastSix', 'moreThanSix'])
    opiatesInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_opiates', ['lastSix', 'moreThanSix'])
    steroidsInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_steroids', ['lastSix', 'moreThanSix'])
    otherInjectedLastSixMonths = new SanElement.CheckboxGroup<'lastSix' | 'moreThanSix'>('#drugs_injected_other_drug', ['lastSix', 'moreThanSix'])

    treatment = new SanElement.Radiogroup<'yes' | 'no'>('#drugs_is_receiving_treatment', ['yes', 'no'])
    treatmentYesDetails = new SanElement.Textbox('#drugs_is_receiving_treatment_yes_details')
}
/*

    // Drugs
  



    whyStarted: {
        type: 'checkbox', id: '#drugs_reasons_for_use',
        options: ['cultural', 'curiosity', 'performance', 'escapism', 'stress', 'peerPressure', 'recreation', 'selfMedication', 'other'],
    },
    impactDrugs: {
        type: 'checkbox', id: '#drugs_affected_their_life',
        options: ['behavioural', 'community', 'finances', 'offending', 'health', 'relationships', 'other'],
    },
    wantChangesDrugs: {
        type: 'radio', id: '#drug_use_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },

    motivatedToStop: {
        type: 'radio', id: '#drugs_practitioner_analysis_motivated_to_stop',
        options: ['motivated', 'someMotivation', 'noMotivation', 'unknown'],
    },
    drugsStrengths: {
        type: 'radio', id: '#drug_use_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    drugsStrengthsYesDetails: {
        type: 'textbox', id: '#drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    drugsStrengthsNoDetails: {
        type: 'textbox', id: '#drug_use_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    drugsRiskSeriousHarm: {
        type: 'radio',
        id: '#drug_use_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    drugsRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#drug_use_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    drugsRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#drug_use_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    drugsRiskReoffending: {
        type: 'radio',
        id: '#drug_use_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    drugsRiskReoffendingYesDetails: {
        type: 'textbox', id: '#drug_use_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    drugsRiskReoffendingNoDetails: {
        type: 'textbox', id: '#drug_use_practitioner_analysis_risk_of_reoffending_no_details'
    },
*/