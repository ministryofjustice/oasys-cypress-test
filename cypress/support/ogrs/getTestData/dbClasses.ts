import { OasysDateTime } from 'lib/dateTime'

export class OgrsRsr {

    pk: number
    status: string
    dob: string
    gender: string
    offence: string
    s1_32_total_sanctions: number
    s1_40_violent_sanctions: number
    s1_34_contact_adult_score: number
    s1_45_dc_child_score: number
    s1_46_iic_child_score: number
    s1_37_non_contact_score: number
    s1_44_dc_stranger_victim: string
    s1_8_age_at_first_sanction: number
    s1_29_date_current_conviction: string
    s1_33_date_recent_sex_offence: string
    s1_41_current_sexual_mot: string
    s1_43_last_offence_date: string
    s1_38_community_date: string
    s1_30_sexual_element: string
    s2_2_weapon: string
    s3_q4_suitable_accom: string
    s4_q2_unemployed: string
    s6_q4_partner_relationship: string
    s6_q7_dom_abuse: string
    s6_q7_perpetrator_partner: string
    s6_q8_cur_rel_status: string
    s7_q2_reg_activities: string
    s8_q1_drugs_misused: string
    amphetamines_curr_use: string
    benzodiazipines_curr_use: string
    cannabis_curr_use: string
    crack_cocaine_curr_use: string
    ecstasy_curr_use: string
    hallucinogens_curr_use: string
    heroin_curr_use: string
    ketamine_curr_use: string
    methadone_curr_use: string
    misused_prescribed_curr_use: string
    other_curr_use: string
    other_opiate_curr_use: string
    cocaine_hydrochloride_curr_use: string
    solvents_curr_use: string
    spice_curr_use: string
    steriods_curr_use: string
    s8_q8_motiv_drug_misuse: string
    s9_q1_alcohol: string
    s9_q2_binge_drink: string
    s11_q2_impulsivity: string
    s11_q4_temper_control: string
    s12_q1_pro_criminal: string
    r1_2_past_aggr_burglary: string
    r1_2_past_arson: string
    r1_2_past_cd_life: string
    r1_2_past_firearm: string
    r1_2_past_wounding_gbh: string
    r1_2_past_murder: string
    r1_2_past_kidnapping: string
    r1_2_past_robbery: string
    r1_2_past_weapon: string
    prison_ind: string

    constructor(rsrData: string[]) {

        let i = 0
        this.pk = Number.parseInt(rsrData[i++])
        this.status = rsrData[i++]
        this.dob = rsrData[i++]
        this.gender = rsrData[i++]
        this.offence = rsrData[i++]
        this.s1_32_total_sanctions = Number.parseInt(rsrData[i++]) || null
        this.s1_40_violent_sanctions = Number.parseInt(rsrData[i++]) || null
        this.s1_34_contact_adult_score = Number.parseInt(rsrData[i++]) || null
        this.s1_45_dc_child_score = Number.parseInt(rsrData[i++]) || null
        this.s1_46_iic_child_score = Number.parseInt(rsrData[i++]) || null
        this.s1_37_non_contact_score = Number.parseInt(rsrData[i++]) || null
        this.s1_44_dc_stranger_victim = rsrData[i++]
        this.s1_8_age_at_first_sanction = Number.parseInt(rsrData[i++]) || null
        this.s1_29_date_current_conviction = rsrData[i++]
        this.s1_33_date_recent_sex_offence = rsrData[i++]
        this.s1_41_current_sexual_mot = rsrData[i++]
        this.s1_43_last_offence_date = rsrData[i++]
        this.s1_38_community_date = rsrData[i++]
        this.s1_30_sexual_element = rsrData[i++]
        this.s2_2_weapon = rsrData[i++]
        this.s3_q4_suitable_accom = rsrData[i++]
        this.s4_q2_unemployed = rsrData[i++]
        this.s6_q4_partner_relationship = rsrData[i++]
        this.s6_q7_dom_abuse = rsrData[i++]
        this.s6_q7_perpetrator_partner = rsrData[i++]
        // this.s6_q8_cur_rel_status = rsrData[i++]
        // this.s7_q2_reg_activities = rsrData[i++]
        // this.s8_q1_drugs_misused = rsrData[i++]
        // this.amphetamines_curr_use = rsrData[i++]
        // this.benzodiazipines_curr_use = rsrData[i++]
        // this.cannabis_curr_use = rsrData[i++]
        // this.crack_cocaine_curr_use = rsrData[i++]
        // this.ecstasy_curr_use = rsrData[i++]
        // this.hallucinogens_curr_use = rsrData[i++]
        // this.heroin_curr_use = rsrData[i++]
        // this.ketamine_curr_use = rsrData[i++]
        // this.methadone_curr_use = rsrData[i++]
        // this.misused_prescribed_curr_use = rsrData[i++]
        // this.other_curr_use = rsrData[i++]
        // this.other_opiate_curr_use = rsrData[i++]
        // this.cocaine_hydrochloride_curr_use = rsrData[i++]
        // this.solvents_curr_use = rsrData[i++]
        // this.spice_curr_use = rsrData[i++]
        // this.steriods_curr_use = rsrData[i++]
        // this.s8_q8_motiv_drug_misuse = rsrData[i++]
        this.s9_q1_alcohol = rsrData[i++]
        this.s9_q2_binge_drink = rsrData[i++]
        this.s11_q2_impulsivity = rsrData[i++]
        this.s11_q4_temper_control = rsrData[i++]
        this.s12_q1_pro_criminal = rsrData[i++]
        this.r1_2_past_aggr_burglary = rsrData[i++]
        this.r1_2_past_arson = rsrData[i++]
        this.r1_2_past_cd_life = rsrData[i++]
        this.r1_2_past_firearm = rsrData[i++]
        this.r1_2_past_wounding_gbh = rsrData[i++]
        this.r1_2_past_murder = rsrData[i++]
        this.r1_2_past_kidnapping = rsrData[i++]
        this.r1_2_past_robbery = rsrData[i++]
        this.r1_2_past_weapon = rsrData[i++]
        this.prison_ind = rsrData[i++]
    }

    static query(rows: number, whereClause: string): string {
        // TODO add drugs details
        // return `select offender_rsr_scores_pk, rsr_status,
        //             to_char(date_of_birth, '${dateFormat}'), gender_elm, offence_code || offence_subcode,
        //             s1_32_total_sanctions, s1_32_total_sanctions, 
        //             s1_34_contact_adult_score, s1_45_dc_child_score, s1_46_iic_child_score, s1_37_non_contact_score

        //             s1_44_dc_stranger_victim, s1_8_age_at_first_sanction, to_char(s1_29_date_current_conviction, '${dateFormat}'), 
        //             to_char(s1_33_date_recent_sex_offence, '${dateFormat}'), s1_41_current_sexual_mot, 
        //             to_char(s1_43_last_offence_date, '${dateFormat}'), to_char(s1_38_community_date, '${dateFormat}'), s1_30_sexual_element, 
        //             s2_2_weapon, s3_q4_suitable_accom, s4_q2_unemployed, s6_q4_partner_relationship, 
        //             s6_q7_dom_abuse, s6_q7_perpetrator_partner, s6_q8_cur_rel_status , s7_q2_reg_activities, s8_q1_drugs_misused, 
        //             amphetamines_curr_use, benzodiazipines_curr_use, cannabis_curr_use, crack_cocaine_curr_use, ecstasy_curr_use, 
        //             hallucinogens_curr_use, heroin_curr_use, ketamine_curr_use, methadone_curr_use, misused_prescribed_curr_use, 
        //             other_curr_use, other_opiate_curr_use, cocaine_hydrochloride_curr_use, solvents_curr_use, spice_curr_use, 
        //             steriods_curr_use, s8_q8_motiv_drug_misuse, s9_q1_alcohol, s9_q2_binge_drink, s11_q2_impulsivity, s11_q4_temper_control, 
        //             s12_q1_pro_criminal, r1_2_past_aggr_burglary, r1_2_past_arson, r1_2_past_cd_life, r1_2_past_firearm, 
        //             r1_2_past_wounding_gbh, r1_2_past_murder, r1_2_past_kidnapping, r1_2_past_robbery, r1_2_past_weapon, prison_ind

        //             from eor.offender_rsr_scores
        //             where ${whereClause}
        //             order by initiation_date desc fetch first ${rows} rows only`

        return `select offender_rsr_scores_pk, rsr_status,
                    to_char(date_of_birth, '${OasysDateTime.dateFormat}'), gender_elm, offence_code || offence_subcode,
                    s1_32_total_sanctions, s1_40_violent_sanctions, 
                    s1_34_contact_adult_score, s1_45_dc_child_score, s1_46_iic_child_score, s1_37_non_contact_score,

                    s1_44_dc_stranger_victim, s1_8_age_at_first_sanction, to_char(s1_29_date_current_conviction, '${OasysDateTime.dateFormat}'), 
                    to_char(s1_33_date_recent_sex_offence, '${OasysDateTime.dateFormat}'), s1_41_current_sexual_mot, 
                    to_char(s1_43_last_offence_date, '${OasysDateTime.dateFormat}'), to_char(s1_38_community_date, '${OasysDateTime.dateFormat}'), s1_30_sexual_element, 
                    s2_2_weapon, s3_q4_suitable_accom, s4_q2_unemployed, s6_q4_partner_relationship, 
                    s6_q7_dom_abuse, s6_q7_perpetrator_partner,  
                    s9_q1_alcohol, s9_q2_binge_drink, s11_q2_impulsivity, s11_q4_temper_control, 
                    s12_q1_pro_criminal, r1_2_past_aggr_burglary, r1_2_past_arson, r1_2_past_cd_life, r1_2_past_firearm, 
                    r1_2_past_wounding_gbh, r1_2_past_murder, r1_2_past_kidnapping, r1_2_past_robbery, r1_2_past_weapon, prison_ind
                    
                    from eor.offender_rsr_scores
                    where ${whereClause}
                    order by initiation_date desc fetch first ${rows} rows only`
    }
}
