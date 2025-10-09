export class OgrsAssessment {

    assessmentPk: number
    assessmentType: string
    status: string
    offences: DbOffence[] = []
    qaData: string[][]
    textData: string[][]

    constructor(assessmentData: string[]) {

        this.assessmentPk = Number.parseInt(assessmentData[0])
        this.assessmentType = assessmentData[1]
        this.status = assessmentData[2]
    }

    static query(rows: number): string {

        return `select s.oasys_set_pk, s.ref_ass_version_code, s.assessment_status_elm,
                    from oasys_set where s.deleted_date is null
                    order by s.initiation_date fetch first ${rows} rows only`
    }

    static qaQuery(assessmentPk: number): string {

        return `select q.ref_section_code, q.ref_question_code, ra.ref_section_answer
                    from oasys_question q, oasys_answer a, ref_answer ra
                    where q.oasys_section_pk in (select oasys_section_pk from oasys_Section where oasys_set_pk = ${assessmentPk} and currently_hidden_ind <> 'Y')
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
                    from oasys_question
                    where oasys_section_pk in (select oasys_section_pk from oasys_Section where oasys_set_pk = ${assessmentPk} and currently_hidden_ind <> 'Y')
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

export class DbOffence {

    type: string
    offenceDate?: string
    offenceCode: string
    offenceSubCode: string
    offence: string
    subOffence: string
    additionalOffence: string

    constructor(offenceData: string[], offencePivotData: string[]) {

        this.type = offenceData[1]
        if (offenceData[2] != undefined && offenceData[2] != null) this.offenceDate = offenceData[2]

        if (offencePivotData == null) {
            this.offenceCode = null
            this.offenceSubCode = null
            this.offence = null
            this.subOffence = null
            this.additionalOffence = null
        } else {
            this.offenceCode = offencePivotData[0]
            this.offenceSubCode = offencePivotData[1]
            this.offence = offencePivotData[2]
            this.subOffence = offencePivotData[3]
            this.additionalOffence = offencePivotData[4]
        }
    }

    static query(assessmentPk: number): string {

        return `select offence_block_pk, offence_block_type_elm, to_char(offence_date, 'YYYY-MM-DD\"T\"HH24:MI:SS') 
                    from offence_block 
                    where oasys_set_pk = ${assessmentPk} and offence_block_type_elm in ('CURRENT', 'CONCURRENT', 'PRINCIPAL_PROPOSAL')`
    }

    static pivotQuery(offenceBlockPk: string): string {
        return `select p.offence_group_code, p.sub_code, o.offence_group_desc, o.sub_offence_desc, p.additional_offence_ind 
                    from ct_offence_pivot p, ct_offence o
                    where o.offence_group_code = p.offence_group_code and o.sub_code = p.sub_code
                    and p.offence_block_pk = ${offenceBlockPk}`
    }
}
