import { dateFormat } from "../orgsTest"

export class OgrsAssessment {

    assessmentPk: number
    assessmentType: string
    status: string
    dob: string
    gender: string
    offence: string
    prison: string

    qaData: string[][]
    textData: string[][]

    constructor(assessmentData: string[]) {

        this.assessmentPk = Number.parseInt(assessmentData[0])
        this.assessmentType = assessmentData[1]
        this.status = assessmentData[2]
        this.dob = assessmentData[3]
        this.gender = assessmentData[4]
        this.prison = assessmentData[5]
    }

    static query(rows: number): string {

        return `select oasys_set_pk, ref_ass_version_code, assessment_status_elm,
                    to_char(date_of_birth, '${dateFormat}'), gender_elm, prison_ind
                    from eor.oasys_set 
                    where deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE' 
                    order by initiation_date desc fetch first ${rows} rows only`
    }

    static offenceQuery(assessmentPk: number): string {

        return `select p.offence_group_code || p.sub_code 
                    from eor.offence_block o, eor.ct_offence_pivot p
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT'
                    and p.offence_block_pk = o.offence_block_pk and p.additional_offence_ind = 'N'`
    }

    static qaQuery(assessmentPk: number): string {

        return `select q.ref_section_code, q.ref_question_code, ra.ref_answer_code
                    from eor.oasys_question q, eor.oasys_answer a, eor.ref_answer ra
                    where q.oasys_section_pk in (select oasys_section_pk from eor.oasys_Section where oasys_set_pk = ${assessmentPk} and currently_hidden_ind <> 'Y')
                    and q.oasys_question_pk = a.oasys_question_pk
                    and ra.ref_ass_version_code = a.ref_ass_version_code
                    and ra.version_number = a.version_number
                    and ra.ref_section_code = a.ref_section_code
                    and ra.ref_question_code = a.ref_question_code
                    and ra.ref_answer_code = a.ref_answer_code 
                    and q.currently_hidden_ind <> 'Y'
                    order by q.ref_section_code, q.ref_question_code`
    }

    static textAnswerQuery(assessmentPk: number): string {

        return `select ref_section_code, ref_question_code, free_format_answer, additional_note, currently_hidden_ind  
                    from eor.oasys_question
                    where oasys_section_pk in (select oasys_section_pk from eor.oasys_Section where oasys_set_pk = ${assessmentPk} and currently_hidden_ind <> 'Y')
                    and (free_format_answer is not null or additional_note is not null)`
    }
}

// /**
//  * Standalone RSR assessments
//  */
// export class DbRsr extends DbAssessmentOrRsr {

//     constructor(rsrData: string[], versionTable: string[][]) {

//         super(Number.parseInt(rsrData[0]), 'STANDALONE', rsrData[1], rsrData[2], undefined, rsrData[3], rsrData[4], versionTable)
//     }

//     static query(crnSource: Provider, crn: string): string {

//         return `select r.offender_rsr_scores_pk, r.rsr_status, to_char(r.initiation_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
//                             to_char(r.date_completed, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
//                             to_char(r.lastupd_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
//                             r.ogrs3_1year, r.ogrs3_2year, r.ogrs3_risk_recon_elm, r.rsr_static_or_dynamic, 
//                             r.rsr_exception_error, 
//                             r.rsr_algorithm_version, r.rsr_percentage_score, r.rsr_risk_recon_elm, 
//                             r.osp_i_percentage_score, r.osp_c_percentage_score, r.osp_i_risk_recon_elm, r.osp_c_risk_recon_elm,
//                             o.cms_event_number,
//                             r.osp_iic_risk_recon_elm, r.osp_iic_percentage_score, r.osp_dc_risk_recon_elm, r.osp_dc_percentage_score  
//                             from offender_rsr_scores r, offender o 
//                             where r.offender_pk = o.offender_pk and ${crnSource == 'prob' ? 'o.cms_prob_number' : 'o.cms_pris_number'} = '${crn}' 
//                             and o.deleted_date is null and r.deleted_date is null 
//                             order by r.initiation_date`
//     }
// }
