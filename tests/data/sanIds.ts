export const sanIds: SanIds = {

    // Accommodation
    currentAccommodation: {
        type: 'radio',
        id: '#current_accommodation',
        options: ['settled', 'temporary', 'noAccommodation'],
    },
    noAccommodationType: {
        type: 'radio',
        id: '#type_of_no_accommodation',
        options: ['awaitingAssessment', 'campsite', 'hostel', 'homeless', 'roughSleeping', 'shelter'],
    },
    settledAccommodationType: {
        type: 'radio',
        id: '#type_of_settled_accommodation',
        options: ['homeowner', 'friends', 'privateRenting', 'socialRent', 'healthcare', 'supported'],
    },
    temporaryAccommodationType: {
        type: 'radio',
        id: '#type_of_temporary_accommodation',
        options: ['approvedPremises', 'cas2', 'cas3', 'immigration', 'shortTerm'],
    },
    accommodationSuitable: {
        type: 'radio',
        id: '#suitable_housing',
        options: ['yes', 'yesWithConcerns', 'no'],
    },
    futurePlanned: {
        type: 'radio',
        id: '#suitable_housing_planned',
        options: ['yes', 'no'],
    },
    futureType: {
        type: 'radio',
        id: '#future_accommodation_type',
        options: ['awaitingAssessment', 'awatingPlacement', 'buyHouse', 'friends', 'privateRent', 'socialRent', 'healthcare', 'supported', 'other']
    },
    locationSuitable: {
        type: 'radio',
        id: '#suitable_housing_location',
        options: ['yes', 'no'],
    },
    wantChangesAccommodation: {
        type: 'radio',
        id: '#accommodation_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    livingWith: {
        type: 'checkbox',
        id: '#living_with',
        options: ['family', 'friends', 'partner', 'child', 'other', '-', 'alone'],
    },

    accommodationStrengths: {
        type: 'radio',
        id: '#accommodation_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    accommodationStrengthsYesDetails: {
        type: 'textbox', id: '#accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    accommodationStrengthsNoDetails: {
        type: 'textbox', id: '#accommodation_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    accommodationRiskSeriousHarm: {
        type: 'radio',
        id: '#accommodation_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    accommodationRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    accommodationRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    accommodationRiskReoffending: {
        type: 'radio',
        id: '#accommodation_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    accommodationRiskReoffendingYesDetails: {
        type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    accommodationRiskReoffendingNoDetails: {
        type: 'textbox', id: '#accommodation_practitioner_analysis_risk_of_reoffending_no_details'
    },

    // Alcohol
    everDrank: {
        type: 'radio',
        id: '#alcohol_use',
        options: ['yesIncLast3', 'yesNotLast3', 'no'],
    },
    howOftenLast3: {
        type: 'radio',
        id: '#alcohol_frequency',
        options: ['1PerMonth', '2-4PerMonth', '2-3PerWeek', 'more'],
    },
    typicalUnits: {
        type: 'radio',
        id: '#alcohol_units',
        options: ['1To2', '3To4', '5To6', '7To9', '10orMore'],
    },
    had8OrMore: {
        type: 'radio',
        id: '#alcohol_binge_drinking',
        options: ['yes', 'no'],
    },
    had8OrMoreFrequency: {
        type: 'radio',
        id: '#alcohol_binge_drinking_frequency',
        options: ['lessThanMonthly', 'monthly', 'weekly', 'daily'],
    },
    bingeDrinking: {
        type: 'radio',
        id: '#alcohol_evidence_of_excess_drinking',
        options: ['noEvidence', 'someEvidence', 'evidence'],
    },
    pastIssues: {
        type: 'radio',
        id: '#alcohol_past_issues',
        options: ['yes', 'no'],
    },
    anythingHelpedAlcohol: {
        type: 'radio',
        id: '#alcohol_stopped_or_reduced',
        options: ['yes', 'no'],
    },
    wantChangesAlcohol: {
        type: 'radio',
        id: '#alcohol_use_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    whyDrink: {
        type: 'checkbox',
        id: '#alcohol_reasons_for_use',
        options: ['cultural', 'curiosity', 'enjoyment', 'stress', 'occasions', 'peerPressure', 'selfMedication', 'socially', 'other'],
    },
    impactAlcohol: {
        type: 'checkbox',
        id: '#alcohol_impact_of_use',
        options: ['behavioural', 'community', 'finance', 'offending', 'health', 'relationships', 'other', '-', 'noImpact'],
    },


    alcoholStrengths: {
        type: 'radio',
        id: '#alcohol_use_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    alcoholStrengthsYesDetails: {
        type: 'textbox', id: '#alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    alcoholStrengthsNoDetails: {
        type: 'textbox', id: '#alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    alcoholRiskSeriousHarm: {
        type: 'radio',
        id: '#alcohol_use_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    alcoholRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    alcoholRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    alcoholRiskReoffending: {
        type: 'radio',
        id: '#alcohol_use_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    alcoholRiskReoffendingYesDetails: {
        type: 'textbox', id: '#alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    alcoholRiskReoffendingNoDetails: {
        type: 'textbox', id: '#alcohol_use_practitioner_analysis_risk_of_reoffending_no_details'
    },


    // Drugs
    everUsed: {
        type: 'radio',
        id: '#drug_use',
        options: ['yes', 'no'],
    },
    anythingHelpedDrugs: {
        type: 'radio',
        id: '#reducing_or_stopping_drug_use',
        options: ['yes', 'no'],
    },
    motivatedToStop: {
        type: 'radio',
        id: '#motivated_stopping_drug_use',
        options: ['motivated', 'someMotivation', 'noMotivation', 'unknown'],
    },
    drugUsageAmphetamines: {
        type: 'radio',
        id: '#drug_usage_amphetamines',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingAmphetamines: {
        type: 'radio',
        id: '#daily_injecting_drug_amphetamines',
        options: ['yes', 'no'],
    },
    weeklyInjectingAmphetamines: {
        type: 'radio',
        id: '#weekly_injecting_drug_amphetamines',
        options: ['yes', 'no'],
    },
    monthlyInjectingAmphetamines: {
        type: 'radio',
        id: '#monthly_injecting_drug_amphetamines',
        options: ['yes', 'no'],
    },
    occasionallyInjectingAmphetamines: {
        type: 'radio',
        id: '#occasionally_injecting_drug_amphetamines',
        options: ['yes', 'no'],
    },
    pastAmphetamines: {
        type: 'radio',
        id: '#past_drug_usage_amphetamines',
        options: ['yes', 'no'],
    },
    pastInjectingAmphetamines: {
        type: 'radio',
        id: '#past_injecting_drug_amphetamines',
        options: ['yes', 'no'],
    },
    drugUsageBenzodiazepines: {
        type: 'radio',
        id: '#drug_usage_benzodiazepines',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingBenzodiazepines: {
        type: 'radio',
        id: '#daily_injecting_drug_benzodiazepines',
        options: ['yes', 'no'],
    },
    weeklyInjectingBenzodiazepines: {
        type: 'radio',
        id: '#weekly_injecting_drug_benzodiazepines',
        options: ['yes', 'no'],
    },
    monthlyInjectingBenzodiazepines: {
        type: 'radio',
        id: '#monthly_injecting_drug_benzodiazepines',
        options: ['yes', 'no'],
    },
    occasionallyInjectingBenzodiazepines: {
        type: 'radio',
        id: '#occasionally_injecting_drug_benzodiazepines',
        options: ['yes', 'no'],
    },
    pastBenzodiazepines: {
        type: 'radio',
        id: '#past_drug_usage_benzodiazepines',
        options: ['yes', 'no'],
    },
    pastInjectingBenzodiazepines: {
        type: 'radio',
        id: '#past_injecting_drug_benzodiazepines',
        options: ['yes', 'no'],
    },
    drugUsageCannabis: {
        type: 'radio',
        id: '#drug_usage_cannabis',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    pastCannabis: {
        type: 'radio',
        id: '#past_drug_usage_cannabis',
        options: ['yes', 'no'],
    },
    drugUsageCocaine: {
        type: 'radio',
        id: '#drug_usage_cocaine',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingCocaine: {
        type: 'radio',
        id: '#daily_injecting_drug_cocaine',
        options: ['yes', 'no'],
    },
    weeklyInjectingCocaine: {
        type: 'radio',
        id: '#weekly_injecting_drug_cocaine',
        options: ['yes', 'no'],
    },
    monthlyInjectingCocaine: {
        type: 'radio',
        id: '#monthly_injecting_drug_cocaine',
        options: ['yes', 'no'],
    },
    occasionallyInjectingCocaine: {
        type: 'radio',
        id: '#occasionally_injecting_drug_cocaine',
        options: ['yes', 'no'],
    },
    pastCocaine: {
        type: 'radio',
        id: '#past_drug_usage_cocaine',
        options: ['yes', 'no'],
    },
    pastInjectingCocaine: {
        type: 'radio',
        id: '#past_injecting_drug_cocaine',
        options: ['yes', 'no'],
    },
    drugUsageCrack: {
        type: 'radio',
        id: '#drug_usage_crack',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingCrack: {
        type: 'radio',
        id: '#daily_injecting_drug_crack',
        options: ['yes', 'no'],
    },
    weeklyInjectingCrack: {
        type: 'radio',
        id: '#weekly_injecting_drug_crack',
        options: ['yes', 'no'],
    },
    monthlyInjectingCrack: {
        type: 'radio',
        id: '#monthly_injecting_drug_crack',
        options: ['yes', 'no'],
    },
    occasionallyInjectingCrack: {
        type: 'radio',
        id: '#occasionally_injecting_drug_crack',
        options: ['yes', 'no'],
    },
    pastCrack: {
        type: 'radio',
        id: '#past_drug_usage_crack',
        options: ['yes', 'no'],
    },
    pastInjectingCrack: {
        type: 'radio',
        id: '#past_injecting_drug_crack',
        options: ['yes', 'no'],
    },
    drugUsageEcstasy: {
        type: 'radio',
        id: '#drug_usage_ecstasy',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    pastEcstasy: {
        type: 'radio',
        id: '#past_drug_usage_ecstasy',
        options: ['yes', 'no'],
    },
    drugUsageHallucinogenics: {
        type: 'radio',
        id: '#drug_usage_hallucinogenics',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    pastHallucinogenics: {
        type: 'radio',
        id: '#past_drug_usage_hallucinogenics',
        options: ['yes', 'no'],
    },
    drugUsageHeroin: {
        type: 'radio',
        id: '#drug_usage_heroin',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingHeroin: {
        type: 'radio',
        id: '#daily_injecting_drug_heroin',
        options: ['yes', 'no'],
    },
    weeklyInjectingHeroin: {
        type: 'radio',
        id: '#weekly_injecting_drug_heroin',
        options: ['yes', 'no'],
    },
    monthlyInjectingHeroin: {
        type: 'radio',
        id: '#monthly_injecting_drug_heroin',
        options: ['yes', 'no'],
    },
    occasionallyInjectingHeroin: {
        type: 'radio',
        id: '#occasionally_injecting_drug_heroin',
        options: ['yes', 'no'],
    },
    pastHeroin: {
        type: 'radio',
        id: '#past_drug_usage_heroin',
        options: ['yes', 'no'],
    },
    pastInjectingHeroin: {
        type: 'radio',
        id: '#past_injecting_drug_heroin',
        options: ['yes', 'no'],
    },
    drugUsageMethadone: {
        type: 'radio',
        id: '#drug_usage_methadone_not_prescribed',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingMethadone: {
        type: 'radio',
        id: '#daily_injecting_drug_methadone_not_prescribed',
        options: ['yes', 'no'],
    },
    weeklyInjectingMethadone: {
        type: 'radio',
        id: '#weekly_injecting_drug_methadone_not_prescribed',
        options: ['yes', 'no'],
    },
    monthlyInjectingMethadone: {
        type: 'radio',
        id: '#monthly_injecting_drug_methadone_not_prescribed',
        options: ['yes', 'no'],
    },
    occasionallyInjectingMethadone: {
        type: 'radio',
        id: '#occasionally_injecting_drug_methadone_not_prescribed',
        options: ['yes', 'no'],
    },
    pastMethadone: {
        type: 'radio',
        id: '#past_drug_usage_methadone_not_prescribed',
        options: ['yes', 'no'],
    },
    pastInjectingMethadone: {
        type: 'radio',
        id: '#past_injecting_drug_methadone_not_prescribed',
        options: ['yes', 'no'],
    },
    drugUsagePrescribed: {
        type: 'radio',
        id: '#drug_usage_misused_prescribed_drugs',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingPrescribed: {
        type: 'radio',
        id: '#daily_injecting_drug_misused_prescribed_drugs',
        options: ['yes', 'no'],
    },
    weeklyInjectingPrescribed: {
        type: 'radio',
        id: '#weekly_injecting_drug_misused_prescribed_drugs',
        options: ['yes', 'no'],
    },
    monthlyInjectingPrescribed: {
        type: 'radio',
        id: '#monthly_injecting_drug_misused_prescribed_drugs',
        options: ['yes', 'no'],
    },
    occasionallyInjectingPrescribed: {
        type: 'radio',
        id: '#occasionally_injecting_drug_misused_prescribed_drugs',
        options: ['yes', 'no'],
    },
    pastPrescribed: {
        type: 'radio',
        id: '#past_drug_usage_misused_prescribed_drugs',
        options: ['yes', 'no'],
    },
    pastInjectingPrescribed: {
        type: 'radio',
        id: '#past_injecting_drug_misused_prescribed_drugs',
        options: ['yes', 'no'],
    },
    drugUsageOpiates: {
        type: 'radio',
        id: '#drug_usage_other_opiates',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingOpiates: {
        type: 'radio',
        id: '#daily_injecting_drug_other_opiates',
        options: ['yes', 'no'],
    },
    weeklyInjectingOpiates: {
        type: 'radio',
        id: '#weekly_injecting_drug_other_opiates',
        options: ['yes', 'no'],
    },
    monthlyInjectingOpiates: {
        type: 'radio',
        id: '#monthly_injecting_drug_other_opiates',
        options: ['yes', 'no'],
    },
    occasionallyInjectingOpiates: {
        type: 'radio',
        id: '#occasionally_injecting_drug_other_opiates',
        options: ['yes', 'no'],
    },
    pastOpiates: {
        type: 'radio',
        id: '#past_drug_usage_other_opiates',
        options: ['yes', 'no'],
    },
    pastInjectingOpiates: {
        type: 'radio',
        id: '#past_injecting_drug_other_opiates',
        options: ['yes', 'no'],
    },
    drugUsageSolvents: {
        type: 'radio',
        id: '#drug_usage_solvents',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    pastSolvents: {
        type: 'radio',
        id: '#past_drug_usage_solvents',
        options: ['yes', 'no'],
    },
    drugUsageSteroids: {
        type: 'radio',
        id: '#drug_usage_steroids',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingSteroids: {
        type: 'radio',
        id: '#daily_injecting_drug_steroids',
        options: ['yes', 'no'],
    },
    weeklyInjectingSteroids: {
        type: 'radio',
        id: '#weekly_injecting_drug_steroids',
        options: ['yes', 'no'],
    },
    monthlyInjectingSteroids: {
        type: 'radio',
        id: '#monthly_injecting_drug_steroids',
        options: ['yes', 'no'],
    },
    occasionallyInjectingSteroids: {
        type: 'radio',
        id: '#occasionally_injecting_drug_steroids',
        options: ['yes', 'no'],
    },
    pastSteroids: {
        type: 'radio',
        id: '#past_drug_usage_steroids',
        options: ['yes', 'no'],
    },
    pastInjectingSteroids: {
        type: 'radio',
        id: '#past_injecting_drug_steroids',
        options: ['yes', 'no'],
    },
    drugUsageSpice: {
        type: 'radio',
        id: '#drug_usage_spice',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    pastSpice: {
        type: 'radio',
        id: '#past_drug_usage_spice',
        options: ['yes', 'no'],
    },
    drugUsageOther: {
        type: 'radio',
        id: '#drug_usage_other_drug',
        options: ['daily', 'weekly', 'monthly', 'occasionally', '-', 'notCurrently'],
    },
    dailyInjectingOther: {
        type: 'radio',
        id: '#daily_injecting_drug_other_drug',
        options: ['yes', 'no'],
    },
    weeklyInjectingOther: {
        type: 'radio',
        id: '#weekly_injecting_drug_other_drug',
        options: ['yes', 'no'],
    },
    monthlyInjectingOther: {
        type: 'radio',
        id: '#monthly_injecting_drug_other_drug',
        options: ['yes', 'no'],
    },
    occasionallyInjectingOther: {
        type: 'radio',
        id: '#occasionally_injecting_drug_other_drug',
        options: ['yes', 'no'],
    },
    pastOther: {
        type: 'radio',
        id: '#past_drug_usage_other_drug',
        options: ['yes', 'no'],
    },
    pastInjectingOther: {
        type: 'radio',
        id: '#past_injecting_drug_other_drug',
        options: ['yes', 'no'],
    },
    dailyHeroinTreatment: {
        type: 'radio',
        id: '#daily_drug_usage_treatment_heroin',
        options: ['yes', 'no'],
    },
    weeklyHeroinTreatment: {
        type: 'radio',
        id: '#weekly_drug_usage_treatment_heroin',
        options: ['yes', 'no'],
    },
    monthlyHeroinTreatment: {
        type: 'radio',
        id: '#monthly_drug_usage_treatment_heroin',
        options: ['yes', 'no'],
    },
    occasionallyHeroinTreatment: {
        type: 'radio',
        id: '#occasionally_drug_usage_treatment_heroin',
        options: ['yes', 'no'],
    },
    pastHeroinTreatment: {
        type: 'radio',
        id: '#past_drug_usage_treatment_heroin',
        options: ['yes', 'no'],
    },
    wantChangesDrugs: {
        type: 'radio',
        id: '#drug_use_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    whyStarted: {
        type: 'checkbox',
        id: '#drug_use_reasons',
        options: ['cultural', 'curiosity', 'performance', 'escapism', 'stress', 'peerPressure', 'recreation', 'selfMedication', 'other'],
    },
    impactDrugs: {
        type: 'checkbox',
        id: '#drug_use_impact',
        options: ['behavioural', 'community', 'finances', 'offending', 'health', 'relationships', 'other'],
    },
    drugType: {
        type: 'checkbox',
        id: '#drug_use_type',
        options: ['amphetamines', 'benzodiazepines', 'cannabis', 'cocaine', 'crack', 'ecstasy', 'hallucinogenics', 'heroin', 'methadone', 'prescribed', 'opiates', 'solvents', 'spice', 'steroids', 'other'],
    },
    drugTypeOther: {
        type: 'textbox', id: '#drug_use_type_other_drug_details'
    },


    drugsStrengths: {
        type: 'radio',
        id: '#drug_use_practitioner_analysis_strengths_or_protective_factors',
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

    // employment
    employmentStatus: {
        type: 'radio',
        id: '#employment_status',
        options: ['employed', 'selfEmployed', 'retired', 'unavailable', 'unemployedLooking', 'unemployedNotLooking'],
    },
    employmentType: {
        type: 'radio',
        id: '#employment_type',
        options: ['fullTime', 'partTime', 'temporary', 'apprenticeship'],
    },
    unavailableEmployedBefore: {
        type: 'radio',
        id: '#has_been_employed_unavailable_for_work',
        options: ['yes', 'no'],
    },
    lookingEmployedBefore: {
        type: 'radio',
        id: '#has_been_employed_actively_seeking',
        options: ['yes', 'no'],
    },
    notLookingEmployedBefore: {
        type: 'radio',
        id: '#has_been_employed_not_actively_seeking',
        options: ['yes', 'no'],
    },
    employmentHistory: {
        type: 'radio',
        id: '#employment_history',
        options: ['continuous', 'generallyEmployed', 'unstable'],
    },
    highestQual: {
        type: 'radio',
        id: '#education_highest_level_completed',
        options: ['entryLevel', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', '-', 'none', 'notSure'],
    },
    professionalQual: {
        type: 'radio',
        id: '#education_professional_or_vocational_qualifications',
        options: ['yes', 'no', '-', 'notSure'],
    },
    skills: {
        type: 'radio',
        id: '#education_transferable_skills',
        options: ['yes', 'some', 'no'],
    },
    readingLevel: {
        type: 'radio',
        id: '#education_difficulties_reading_severity',
        options: ['significant', 'some'],
    },
    writingLevel: {
        type: 'radio',
        id: '#education_difficulties_writing_severity',
        options: ['significant', 'some'],
    },
    numeracyLevel: {
        type: 'radio',
        id: '#education_difficulties_numeracy_severity',
        options: ['significant', 'some'],
    },
    employmentExperience: {
        type: 'radio',
        id: '#employment_experience',
        options: ['positive', 'mostlyPositive', 'positiveNegative', 'mostlyNegative', 'negative', 'unknown'],
    },
    educationExperience: {
        type: 'radio',
        id: '#education_experience',
        options: ['positive', 'mostlyPositive', 'positiveNegative', 'mostlyNegative', 'negative', 'unknown'],
    },
    wantChangesEmployment: {
        type: 'radio',
        id: '#employment_education_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    additionalCommitments: {
        type: 'checkbox',
        id: '#employment_other_responsibilities',
        options: ['caring', 'child', 'studying', 'volunteering', 'other', '-', 'none'],
    },
    difficulties: {
        type: 'checkbox',
        id: '#education_difficulties',
        options: ['reading', 'writing', 'numeracy', '-', 'none'],
    },
    professionalQualDetails: {
        type: 'textbox', id: '#education_professional_or_vocational_qualifications_yes_details'
    },

    employmentStrengths: {
        type: 'radio',
        id: '#employment_education_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    employmentStrengthsYesDetails: {
        type: 'textbox', id: '#employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    employmentStrengthsNoDetails: {
        type: 'textbox', id: '#employment_education_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    employmentRiskSeriousHarm: {
        type: 'radio',
        id: '#employment_education_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    employmentRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#employment_education_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    employmentRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#employment_education_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    employmentRiskReoffending: {
        type: 'radio',
        id: '#employment_education_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    employmentRiskReoffendingYesDetails: {
        type: 'textbox', id: '#employment_education_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    employmentRiskReoffendingNoDetails: {
        type: 'textbox', id: '#employment_education_practitioner_analysis_risk_of_reoffending_no_details'
    },

    // Finance
    overReliant: {
        type: 'radio',
        id: '#family_or_friends_details',
        options: ['yes', 'no'],
    },
    ownAccount: {
        type: 'radio',
        id: '#finance_bank_account',
        options: ['yes', 'no', 'unknown'],
    },
    howGoodManaging: {
        type: 'radio',
        id: '#finance_money_management',
        options: ['ableStrength', 'able', 'unable', 'unableProblems'],
    },
    wantChangesFinance: {
        type: 'radio',
        id: '#finance_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    incomeSource: {
        type: 'checkbox',
        id: '#finance_income',
        options: ['carersAllowance', 'disabilityBenefits', 'employment', 'family', 'offending', 'pension', 'studentLoan', 'undeclared', 'workBenefits', 'other', '-', 'noMoney'],
    },
    gambling: {
        type: 'checkbox',
        id: '#finance_gambling',
        options: ['own', 'someoneElse', '-', 'no', 'unknown'],
    },
    debt: {
        type: 'checkbox',
        id: '#finance_debt',
        options: ['own', 'someoneElse', '-', 'no', 'unknown'],
    },

    financeStrengths: {
        type: 'radio',
        id: '#finance_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    financeStrengthsYesDetails: {
        type: 'textbox', id: '#finance_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    financeStrengthsNoDetails: {
        type: 'textbox', id: '#finance_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    financeRiskSeriousHarm: {
        type: 'radio',
        id: '#finance_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    financeRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#finance_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    financeRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#finance_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    financeRiskReoffending: {
        type: 'radio',
        id: '#finance_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    financeRiskReoffendingYesDetails: {
        type: 'textbox', id: '#finance_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    financeRiskReoffendingNoDetails: {
        type: 'textbox', id: '#finance_practitioner_analysis_risk_of_reoffending_no_details'
    },


    // Health
    physicalHealthConditions: {
        type: 'radio',
        id: '#health_wellbeing_physical_health_condition',
        options: ['yes', 'no', 'unknown'],
    },
    mentalHealthProblems: {
        type: 'radio',
        id: '#health_wellbeing_mental_health_condition',
        options: ['yesOngoingSevere', 'yesOngoing', 'yesPast', 'no', 'unknown'],
    },
    psychTreatment: {
        type: 'radio',
        id: '#health_wellbeing_psychiatric_treatment',
        options: ['yes', 'pending', 'no', 'unknown'],
    },
    headInjury: {
        type: 'radio',
        id: '#health_wellbeing_head_injury_or_illness',
        options: ['yes', 'no', 'unknown'],
    },
    neurodiverse: {
        type: 'radio',
        id: '#health_wellbeing_neurodiverse_conditions',
        options: ['yes', 'no', 'unknown'],
    },
    learningDifficulties: {
        type: 'radio',
        id: '#health_wellbeing_learning_difficulties',
        options: ['yesSignificant', 'yesSome', 'no'],
    },
    coping: {
        type: 'radio',
        id: '#health_wellbeing_coping_day_to_day_life',
        options: ['yes', 'someDifficulties', 'no'],
    },
    attitude: {
        type: 'radio',
        id: '#health_wellbeing_attitude_towards_self',
        options: ['positive', 'mixed', 'negative'],
    },
    selfHarmed: {
        type: 'radio',
        id: '#health_wellbeing_self_harmed',
        options: ['yes', 'no'],
    },
    suicide: {
        type: 'radio',
        id: '#health_wellbeing_attempted_suicide_or_suicidal_thoughts',
        options: ['yes', 'no'],
    },
    optimistic: {
        type: 'radio',
        id: '#health_wellbeing_outlook',
        options: ['optimistic', 'notSure', 'notOptimistic', '-', 'notAnswering', 'notPresent'],
    },
    wantChangesHealth: {
        type: 'radio',
        id: '#health_wellbeing_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    selfHarmedDetails: {
        type: 'textbox', id: '#health_wellbeing_self_harmed_yes_details'
    },
    suicideDetails: {
        type: 'textbox', id: '#health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details'
    },

    healthStrengths: {
        type: 'radio',
        id: '#health_wellbeing_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    healthStrengthsYesDetails: {
        type: 'textbox', id: '#health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    healthStrengthsNoDetails: {
        type: 'textbox', id: '#health_wellbeing_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    healthRiskSeriousHarm: {
        type: 'radio',
        id: '#health_wellbeing_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    healthRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    healthRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    healthRiskReoffending: {
        type: 'radio',
        id: '#health_wellbeing_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    healthRiskReoffendingYesDetails: {
        type: 'textbox', id: '#health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    healthRiskReoffendingNoDetails: {
        type: 'textbox', id: '#health_wellbeing_practitioner_analysis_risk_of_reoffending_no_details'
    },


    // Relationships
    anyChildren: {
        type: 'checkbox', id: '#personal_relationships_community_children_details',
        options: ['yesLiveWith', 'yesLiveElsewhere', 'yesVisitRegularly', 'no'],
    },
    happyWithStatus: {
        type: 'radio',
        id: '#personal_relationships_community_current_relationship',
        options: ['happy', 'someConcerns', 'unhappy'],
    },
    history: {
        type: 'radio',
        id: '#personal_relationships_community_intimate_relationship',
        options: ['stable', 'mixed', 'unstable'],
    },
    manageParenting: {
        type: 'radio',
        id: '#personal_relationships_community_parental_responsibilities',
        options: ['yes', 'sometimes', 'no', 'unknown'],
    },
    currentFamilyRelationship: {
        type: 'radio',
        id: '#personal_relationships_community_family_relationship',
        options: ['stable', 'mixed', 'unstable', 'unknown'],
    },
    childhoodExperience: {
        type: 'radio',
        id: '#personal_relationships_community_childhood',
        options: ['positive', 'mixed', 'negative'],
    },
    behaviouralProblems: {
        type: 'radio',
        id: '#personal_relationships_community_childhood_behaviour',
        options: ['yes', 'no'],
    },
    wantChangesRelationships: {
        type: 'radio',
        id: '#personal_relationships_community_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },
    importantPeople: {
        type: 'checkbox',
        id: '#personal_relationships_community_important_people',
        options: ['partner', 'ownChildren', 'otherChildren', 'family', 'friends', 'other'],
    },
    importantOtherDetails: {
        type: 'textbox', id: '#personal_relationships_community_important_people_other_details'
    },
    resolveChallenges: {
        type: 'textbox', id: '#personal_relationships_community_challenges_intimate_relationship'
    },

    relationshipsStrengths: {
        type: 'radio',
        id: '#personal_relationships_community_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    relationshipsStrengthsYesDetails: {
        type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    relationshipsStrengthsNoDetails: {
        type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    relationshipsRiskSeriousHarm: {
        type: 'radio',
        id: '#personal_relationships_community_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    relationshipsRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    relationshipsRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    relationshipsRiskReoffending: {
        type: 'radio',
        id: '#personal_relationships_community_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    relationshipsRiskReoffendingYesDetails: {
        type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    relationshipsRiskReoffendingNoDetails: {
        type: 'textbox', id: '#personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details'
    },


    // Thinking
    awareConsequences: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_consequences',
        options: ['yes', 'sometimes', 'no'],
    },
    stableBehaviour: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_stable_behaviour',
        options: ['yes', 'sometimes', 'no'],
    },
    activitiesLinkedOffending: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_offending_activities',
        options: ['proSocialActivities', 'sometimes', 'regularly'],
    },
    resilient: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_peer_pressure',
        options: ['yes', 'hasBeen', 'no'],
    },
    ableSolveProblems: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_problem_solving',
        options: ['yes', 'limited', 'no'],
    },
    understandOthers: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_peoples_views',
        options: ['yes', 'someConsideration', 'no'],
    },
    manipulativeBehaviour: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_manipulative_predatory_behaviour',
        options: ['honest', 'some', 'showsPattern'],
    },
    riskOfSexualHarm: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_risk_sexual_harm',
        options: ['yes', 'no'],
    },
    sexualPreoccupation: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_sexual_preoccupation',
        options: ['yes', 'sometimes', 'no', 'unknown'],
    },
    sexualInterests: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_offence_related_sexual_interest',
        options: ['yes', 'sometimes', 'no', 'unknown'],
    },
    emotionalIntimacy: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_emotional_intimacy',
        options: ['yes', 'sometimes', 'no', 'unknown'],
    },
    manageTemper: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_temper_management',
        options: ['yes', 'sometimes', 'no'],
    },
    violence: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_violence_controlling_behaviour',
        options: ['no', 'sometimes', 'yes'],
    },
    impulse: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_impulsive_behaviour',
        options: ['no', 'sometimes', 'yes'],
    },
    positiveAttitude: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_positive_attitude',
        options: ['yes', 'partly', 'no'],
    },
    hostileOrientation: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_hostile_orientation',
        options: ['no', 'sometimes', 'yes'],
    },
    acceptSupervision: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_supervision',
        options: ['yes', 'unsure', 'no'],
    },
    supportCriminalBehaviour: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_criminal_behaviour',
        options: ['no', 'sometimes', 'yes'],
    },
    wantChangesThinking: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_changes',
        options: ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'],
    },

    thinkingStrengths: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors',
        options: ['yes', 'no'],
    },
    thinkingStrengthsYesDetails: {
        type: 'textbox', id: '#thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details'
    },
    thinkingStrengthsNoDetails: {
        type: 'textbox', id: '#thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_no_details'
    },
    thinkingRiskSeriousHarm: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm',
        options: ['yes', 'no'],
    },
    thinkingRiskSeriousHarmYesDetails: {
        type: 'textbox', id: '#thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details'
    },
    thinkingRiskSeriousHarmNoDetails: {
        type: 'textbox', id: '#thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_no_details'
    },
    thinkingRiskReoffending: {
        type: 'radio',
        id: '#thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending',
        options: ['yes', 'no'],
    },
    thinkingRiskReoffendingYesDetails: {
        type: 'textbox', id: '#thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details'
    },
    thinkingRiskReoffendingNoDetails: {
        type: 'textbox', id: '#thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_no_details'
    },

    // Offence analysis
    offenceDescription: {
        type: 'textbox', id: '#offence_analysis_description_of_offence',
    },

    offenceElements: {
        type: 'checkbox',
        id: '#offence_analysis_elements',
        options: ['arson', 'domesticAbuse', 'excessiveViolence', 'hatred', 'physicalDamage', 'sexualElement', 'victimTargeted', 'violence', 'weapon', 'none']
    },

    victimTargetedDetails: {
        type: 'textbox', id: '#offence_analysis_elements_victim_targeted_details',
    },

    reason: {
        type: 'textbox', id: '#offence_analysis_reason',
    },

    motivations: {
        type: 'checkbox', id: '#offence_analysis_motivations',
        options: ['addictions', 'pressure', 'emotional', 'financial', 'hatred', 'power', 'sexual', 'thrill', 'other']
    },

    motivationOther: { type: 'textbox', id: '#offence_analysis_motivations_other_details' },

    victimType: {
        type: 'checkbox', id: '#offence_analysis_who_was_the_victim', options: ['people', 'other']
    },

    victimTypeDetails: {
        type: 'textbox', id: '#offence_analysis_who_was_the_victim_other_details'
    },

    victimRelationship: {
        type: 'radio', id: '#offence_analysis_victim_relationship',
        options: ['stranger', 'staff', 'parent', 'partner', 'exPartner', 'child', 'otherFamily', 'other']
    },

    victimRelationshipOtherDetails: {
        type: 'textbox', id: '#offence_analysis_victim_relationship_other_details'
    },

    victimAge: {
        type: 'radio', id: '#offence_analysis_victim_age',
        options: ['0to4', '5to11', '12to15', '16to17', '18to20', '21to25', '26to49', '50to64', '65plus']
    },

    victimSex: {
        type: 'radio', id: '#offence_analysis_victim_sex',
        options: ['male', 'female', 'intersex', 'unknown']
    },

    victimRace: {
        type: 'combo', id: '#offence_analysis_victim_race'
    },

    /*
    White - English, Welsh, Scottish, Northern Irish or British
    White - Irish
    White - Gypsy or Irish Traveller
    White - Any other White background
    Mixed - White and Black Caribbean
    Mixed - White and Black African
    Mixed - White and Asian
    Mixed - Any other mixed or multiple ethnic background background
    Asian or Asian British - Indian
    Asian or Asian British - Pakistani
    Asian or Asian British - Bangladeshi
    Asian or Asian British - Chinese
    Asian or Asian British - Any other Asian background
    Black or Black British - Caribbean
    Black or Black British - African
    Black or Black British - Any other Black background
    Arab
    Any other ethnic group
    Not stated
    */

    howManyOthers: {
        type: 'radio', id: '#offence_analysis_how_many_involved',
        options: ['0', '1', '2', '3', '4', '5', '6to10', '11to15', 'more']
    },

    leader: {
        type: 'radio', id: '#offence_analysis_leader', options: ['yes', 'no']
    },

    leaderYesDetails: {
        type: 'textbox', id: '#offence_analysis_leader_yes_details',
    },

    leaderNoDetails: {
        type: 'textbox', id: '#offence_analysis_leader_no_details',
    },

    impact: {
        type: 'radio', id: '#offence_analysis_impact_on_victims', options: ['yes', 'no']
    },

    responsibility: {
        type: 'radio', id: '#offence_analysis_accept_responsibility', options: ['yes', 'no']
    },

    responsibilityYesDetails: {
        type: 'textbox', id: '#offence_analysis_accept_responsibility_yes_details',
    },

    responsibilityNoDetails: {
        type: 'textbox', id: '#offence_analysis_accept_responsibility_no_details',
    },

    patterns: {
        type: 'textbox', id: '#offence_analysis_patterns_of_offending',
    },

    escalation: {
        type: 'radio', id: '#offence_analysis_escalation', options: ['yes', 'no', 'na']
    },

    riskSeriousHarm: {
        type: 'radio', id: '#offence_analysis_risk', options: ['yes', 'no']
    },

    riskSeriousHarmYesDetails: {
        type: 'textbox', id: '#offence_analysis_risk_yes_details',
    },

    riskSeriousHarmNoDetails: {
        type: 'textbox', id: '#offence_analysis_risk_no_details',
    },


    domesticAbusePerpertrator: {
        type: 'radio', id: '#offence_analysis_perpetrator_of_domestic_abuse', options: ['yes', 'no']
    },

    domesticAbusePerpertratorType: {
        type: 'radio', id: '#offence_analysis_perpetrator_of_domestic_abuse_type', options: ['family', 'partner', 'both']
    },

    familyPerpetratorDetails: { type: 'textbox', id: '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details' },
    partnerPerpetratorDetails: { type: 'textbox', id: '#offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details' },
    bothPerpetratorDetails: { type: 'textbox', id: '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details' },

    domesticAbuseVictim: {
        type: 'radio', id: '#offence_analysis_victim_of_domestic_abuse', options: ['yes', 'no']
    },

    familyVictimDetails: { type: 'textbox', id: '#offence_analysis_victim_of_domestic_abuse_type_family_member_details' },
    partnerVictimDetails: { type: 'textbox', id: '#offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details' },
    bothVictimDetails: { type: 'textbox', id: '#offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details' },

    domesticAbuseVictimType: {
        type: 'radio', id: '#offence_analysis_victim_of_domestic_abuse_type', options: ['family', 'partner', 'both']
    },

    // Sentence plan
    goal: { type: 'textbox', id: '#goal-input-autocomplete' },
    related: { type: 'radio', id: '#related-area-of-need-radio', options: ['yes', 'no'] },
    startNow: { type: 'radio', id: '#start-working-goal-radio', options: ['yes', 'no'] },
    targetDate: {
        type: 'radio', id: '#date-selection-radio',
        options: ['3Months', '6Months', '12Months', '-', 'other']
    },
    who: { type: 'select', id: '#step-actor-1' },
    step: { type: 'textbox', id: '#step-description-1' },
    planAgreed: { type: 'radio', id: '#agree-plan-radio', options: ['yes', 'no', 'notAnswered'] },

    // Actions

    saveAndContinue: { type: 'button', id: 'Save and continue' },
    change: { type: 'action', id: '' },
    change2: { type: 'action', id: '' },
    change3: { type: 'action', id: '' },
    practitionerAnalysis: { type: 'action', id: '' },
    markAsComplete: { type: 'button', id: 'Mark as complete' },
    changeAnalysis: { type: 'action', id: '' },
    back: { type: 'action', id: '' },
    backIfVisible: { type: 'action', id: '' },
    changeIfVisible: { type: 'action', id: '' },
    addAnotherVictim: { type: 'button', id: 'Add another victim' },
    agreePlan: { type: 'button', id: 'Agree plan' },
    save: { type: 'button', id: 'Save' },
    createGoal: { type: 'button', id: 'Create goal' },
    addSteps: { type: 'button', id: 'Add steps' },
    addChangeSteps: { type: 'button', id: 'Add or change steps' },
    addAnotherStep: { type: 'button', id: 'Add another step' },
    saveWithoutSteps: { type: 'button', id: 'Save without steps' },
}