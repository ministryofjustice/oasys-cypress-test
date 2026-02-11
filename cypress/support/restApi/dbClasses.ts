/**
 * Classes used to extract data from the OASys database for use in API regression testing.
 * These objects are created by the RestDb functions in cypress/support/restApidb.ts using the queries defined here.
 */

import { stringToInt } from 'lib/utils'
import { OasysDateTime } from 'oasys'
import { QaData } from '../data/qaData'
import { assignValues, buildQuery, getColumns } from '../data/queryBuilder'


/**
 * Single offender with all relevant assessment data
 */
export class DbOffenderWithAssessments {

    probationCrn: string
    nomisId: string
    offenderPk: number
    riskToOthers: string
    limitedAccessOffender: boolean
    pnc: string
    forename1: string
    surname: string
    gender: number
    custodyInd: string
    assessments: DbAssessmentOrRsr[] = []

    dbElapsedTime: number

    constructor(offenderData: string[]) {

        let i = 0
        this.offenderPk = Number.parseInt(offenderData[i++])
        this.probationCrn = offenderData[i++]
        this.nomisId = offenderData[i++]
        this.riskToOthers = offenderData[i++]
        this.limitedAccessOffender = offenderData[i++] == 'Y'
        this.pnc = offenderData[i++]
        this.forename1 = offenderData[i++]
        this.surname = offenderData[i++]
        this.gender = Number.parseInt(offenderData[i++])
        this.custodyInd = offenderData[i++]
    }

    static query(crnSource: Provider, crn: string): string {

        return `select offender_pk, cms_prob_number, cms_pris_number, risk_to_others_elm, limited_access_offender, 
                    pnc, forename_1, family_name, gender_elm, custody_ind
                    from eor.offender where deleted_date is null 
                    and ${crnSource == 'prob' ? 'cms_prob_number' : 'cms_pris_number'} = '${crn}'`
    }
}

/**
 * Base class for assessments and standalone RSRs
 */
export class DbAssessmentOrRsr {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    status: string
    initiationDate: string
    signedDate: string
    completedDate: string
    lastUpdatedDate: string
    riskDetails: DbRiskDetails
    cmsEventNumber: number
    appVersion: string

}

/**
 * OASys assessment including sections, questions and answers, offences, victims and objectives
 */
export class DbAssessment extends DbAssessmentOrRsr {

    signedDate: string
    roshLevel: string
    pOAssessment: string
    pOAssessmentDesc: string
    assessorName: string
    courtCode: string
    courtType: string
    courtName: string
    parentAssessmentPk: number
    sanIndicator: string
    dateOfBirth: string
    learningToolScore: number
    ldcSubTotal: number
    ldcFuncProc: string
    offences: DbOffence[] = []
    victims: DbVictim[] = []
    basicSentencePlan: DbBspObjective[] = []
    objectives: DbObjective[] = []

    sections: DbSection[] = []
    qaData: QaData

    constructor(assessmentData: string[]) {

        super()

        assignValues(this, assessmentColumns, assessmentData, 0)
        this.riskDetails = new DbRiskDetails(assessmentData, Object.keys(assessmentColumns).length, 'assessment')
        this.appVersion = OasysDateTime.dateToVersion(this.initiationDate)
    }

    static query(offenderPk: number): string {

        return buildQuery(
            [assessmentColumns, riskColumns, riskColumnsAssessmentOnly],
            ['oasys_set', 'oasys_assessment_group', 'oasys_set_change'],
            `eor.oasys_assessment_group.offender_pk = ${offenderPk} 
                and eor.oasys_assessment_group.oasys_assessment_group_pk = eor.oasys_set.oasys_assessment_group_pk 
                and eor.oasys_set_change.oasys_set_pk = eor.oasys_set.oasys_set_pk 
                and eor.oasys_set.deleted_date is null`,
            `eor.oasys_set.initiation_date`
        )

        let query = 'select '
        query = query.concat(getColumns(assessmentColumns, 'os'))
        query = query.concat(getColumns(riskColumns, 'os'))
        query = query.concat(getColumns(riskColumnsAssessmentOnly, 'os')).slice(0, -1).concat(' \n') // remove last comma}

        return query.concat(
            `from eor.oasys_assessment_group oag, eor.oasys_set os, eor.oasys_set_change osc 
            where oag.offender_pk = ${offenderPk} and oag.oasys_assessment_group_pk = os.oasys_assessment_group_pk 
            and osc.oasys_set_pk = os.oasys_set_pk 
            and os.deleted_date is null
            order by os.initiation_date`)
    }

    addCourtDetails(courtData: string[]) {

        this.courtCode = courtData[0]
        this.courtName = courtData[1]
        this.courtType = courtData[2]
    }

    static courtQuery(assessmentPk: number): string {

        return `select c.court_code, c.court_name, c.court_type_elm 
                    from eor.court c, eor.offence_block o 
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT' 
                    and c.court_pk = o.court_pk`
    }

    static qaQuery(assessmentPk: number): string {

        return `select oq.ref_question_code, oq.free_format_answer, oq.additional_note, ra.ref_section_answer
                        from eor.oasys_set os
                        left outer join eor.oasys_section osec
                        on osec.oasys_set_pk = os.oasys_set_pk
                        left outer join eor.oasys_question oq
                        on oq.oasys_section_pk = osec.oasys_section_pk
                        left outer join eor.oasys_answer oa
                        on oa.oasys_question_pk = oq.oasys_question_pk
                        left outer join eor.ref_answer ra
                        on (ra.ref_ass_version_code = oa.ref_ass_version_code
                        and ra.version_number = oa.version_number
                        and ra.ref_section_code = oa.ref_section_code
                        and ra.ref_question_code = oa.ref_question_code
                        and ra.ref_answer_code = oa.ref_answer_code )
                        where os.oasys_set_pk =  ${assessmentPk}
                        and oq.currently_hidden_ind = 'N'`
    }
}

/**
 * Standalone RSR assessments
 */
export class DbRsr extends DbAssessmentOrRsr {

    constructor(assessmentData: string[]) {

        super()

        assignValues(this, rsrColumns, assessmentData, 0)
        this.riskDetails = new DbRiskDetails(assessmentData, Object.keys(rsrColumns).length, 'rsr')
        this.appVersion = OasysDateTime.dateToVersion(this.initiationDate)

        this.cmsEventNumber = null
        this.assessmentType = 'STANDALONE'
        this.assessmentVersion = null
    }

    static query(offenderPk: number): string {

        let query = 'select '
        query = query.concat(getColumns(rsrColumns, 'r'))
        query = query.concat(getColumns(riskColumns, 'r')).slice(0, -1).concat(' \n') // remove last comma}

        return query.concat(
            `from eor.offender_rsr_scores r 
                    where r.offender_pk = ${offenderPk}
                    and r.deleted_date is null
                    order by r.initiation_date`)
    }
}

/**
 * Risk data from the oasys_set or standalone_rsr record
 */
export class DbRiskDetails {

    ogrs31Year: number
    ogrs32Year: number
    ogrs3RiskRecon: string

    ospImagePercentageScore: number = 0
    ospContactPercentageScore: number = 0
    ospIRisk: string = 'NA'
    ospCRisk: string = 'NA'

    ospIicRisk: string
    ospIicPercentageScore: number
    ospDcRisk: string
    ospDcPercentageScore: number
    ospCRiskReduction: string

    ogpStWesc: number = null
    ogpDyWesc: number = null
    ogpTotWesc: number = null
    ogp1Year: number
    ogp2Year: number = null
    ogpRisk: string = null

    ovpStWesc: number = null
    ovpDyWesc: number = null
    ovpTotWesc: number = null
    ovp1Year: number = null
    ovp2Year: number = null
    ovpRisk: string = null
    ovpPrevWesc: number = null
    ovpNonVioWesc: number = null
    ovpAgeWesc: number = null
    ovpVioWesc: number = null
    ovpSexWesc: number = null

    ogrs4gPercentageScore: number
    ogrs4gRisk: string
    ogrs4gCalculated: string
    ogp2PercentageScore: number
    ogp2Risk: string
    ogp2Calculated: string

    ogrs4vPercentageScore: number
    ogrs4vRisk: string
    ogrs4vCalculated: string
    ovp2PercentageScore: number
    ovp2Risk: string
    ovp2Calculated: string

    snsvStaticPercentageScore: number
    snsvStaticRisk: string
    snsvStaticCalculated: string
    snsvDynamicPercentageScore: number
    snsvDynamicRisk: string
    snsvDynamicCalculated: string

    rsrStaticOrDynamic: string
    rsrExceptionError: string
    rsrAlgorithmVersion: number
    rsrPercentageScore: number
    rsrRisk: string

    constructor(riskData: string[], start: number, type: 'assessment' | 'rsr') {

        assignValues(this, riskColumns, riskData, start)
        if (type == 'assessment') {
            assignValues(this, riskColumnsAssessmentOnly, riskData, start + Object.keys(riskColumns).length)
        }
    }
}

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
                    from eor.offence_block 
                    where oasys_set_pk = ${assessmentPk} and offence_block_type_elm in ('CURRENT', 'CONCURRENT', 'PRINCIPAL_PROPOSAL')`
    }

    static pivotQuery(offenceBlockPk: string): string {
        return `select p.offence_group_code, p.sub_code, o.offence_group_desc, o.sub_offence_desc, p.additional_offence_ind 
                    from eor.ct_offence_pivot p, eor.ct_offence o
                    where o.offence_group_code = p.offence_group_code and o.sub_code = p.sub_code
                    and p.offence_block_pk = ${offenceBlockPk}`
    }
}


export class DbVictim {

    displaySort: number
    age: string
    gender: string
    ethnicCategory: string
    victimRelation: string

    constructor(victimData: string[]) {

        if (victimData[0] != null) this.displaySort = Number.parseInt(victimData[0])
        if (victimData[1] != null) this.age = victimData[1]
        if (victimData[2] != null) this.gender = victimData[2]
        if (victimData[3] != null) this.ethnicCategory = victimData[3]
        if (victimData[4] != null) this.victimRelation = victimData[4]
    }

    static query(assessmentPk: number): string {
        return `select v.display_sort, ar.ref_element_desc, gr.ref_element_desc, er.ref_element_desc, rr.ref_element_desc from eor.victim v
                        left outer join eor.ref_element ar on v.age_of_victim_elm = ar.ref_element_code and ar.ref_category_code = 'AGE_OF_VICTIM'
                        left outer join eor.ref_element gr on v.gender_elm = gr.ref_element_code and gr.ref_category_code = 'GENDER'
                        left outer join eor.ref_element er on v.ethnic_category_elm = er.ref_element_code and er.ref_category_code = 'ETHNIC_CATEGORY'
                        left outer join eor.ref_element rr on v.victim_relation_elm = rr.ref_element_code and rr.ref_category_code = 'VICTIM_PERPETRATOR_RELATIONSHIP'
                        where v.oasys_set_pk = ${assessmentPk}`
    }

}

export class DbSection {

    sectionCode: string
    sectionPk: number
    otherWeightedScore: number
    lowScoreNeedsAttn: string
    crimNeedScoreThreshold: number
    sanCrimNeedScore: number

    constructor(sectionData: string[], assessmentType: string, assessmentVersion: number) {

        const l31 = assessmentType == 'LAYER3' && assessmentVersion == 1
        const san = assessmentType == 'LAYER3' && assessmentVersion == 2

        this.sectionCode = sectionData[0]
        this.sectionPk = Number.parseInt(sectionData[1])
        this.otherWeightedScore = l31 ? stringToInt(sectionData[2]) : null
        this.lowScoreNeedsAttn = sectionData[3]
        this.crimNeedScoreThreshold = stringToInt(sectionData[4])
        this.sanCrimNeedScore = san ? stringToInt(sectionData[5]) : null
    }

    static query(assessmentPk: number): string {

        return `select s.ref_section_code, s.oasys_section_pk, s.sect_other_weighted_score, s.low_score_need_attn_ind, r.crim_need_score_threshold, s.san_crim_need_score
                    from eor.oasys_section s, eor.ref_section r 
                    where s.oasys_set_pk = ${assessmentPk}
                    and r.ref_section_code = s.ref_section_code
                    and r.ref_ass_version_code = s.ref_ass_version_code
                    and r.version_number = s.version_number
                    and currently_hidden_ind <> 'Y'`
    }
}

export class DbBspObjective {

    bspAreaLinked: string
    bspAreaLinkedDesc: string


    constructor(objectiveData: string[]) {

        this.bspAreaLinked = objectiveData[0]
        this.bspAreaLinkedDesc = objectiveData[1]
    }

    static query(assessmentPk: number): string {

        return `select offence_behav_link_elm, r.ref_element_desc 
                    from eor.basic_sentence_plan_obj o, eor.ref_element r
                    where o.oasys_set_pk = ${assessmentPk}
                    and r.ref_category_code = o.offence_behav_link_cat
                    and r.ref_element_code = o.offence_behav_link_elm`
    }
}

export class DbObjective {

    objectivePk: string
    objectiveCode: string
    objectiveCodeDesc: string
    objectiveDesc: string
    objectiveStatus: string
    objectiveStatusDesc: string
    objectiveSequence: number

    criminogenicNeeds: DbNeed[] = []
    actions: DbAction[] = []


    constructor(objectiveData: string[]) {

        this.objectivePk = objectiveData[0]
        this.objectiveCode = objectiveData[4]
        this.objectiveCodeDesc = objectiveData[1]
        this.objectiveDesc = objectiveData[5]
        this.objectiveStatus = objectiveData[2]
        this.objectiveStatusDesc = objectiveData[6]
        this.objectiveSequence = Number.parseInt(objectiveData[3])
    }

    static query(assessmentPk: number): string {

        return `select ois.ssp_objectives_in_set_pk, o.objective_desc, m.objective_status_elm, ois.display_sort, so.objective_code, 
                    REPLACE( so.objective_desc, chr(2),''), r.ref_element_desc  
                    from eor.ssp_objectives_in_set ois, eor.ssp_objective so, eor.objective o, eor.ssp_objective_measure m, eor.ref_element r 
                    where so.ssp_objectives_in_set_pk = ois.ssp_objectives_in_set_pk
                    and m.ssp_objectives_in_set_pk = ois.ssp_objectives_in_set_pk
                    and o.objective_code = so.objective_code
                    and ois.oasys_set_pk = ${assessmentPk}
                    and r.ref_category_code = m.objective_status_cat and r.ref_element_code = m.objective_status_elm 
                    and ois.objective_type_elm = 'CURRENT'`
    }

}

export class DbNeed {

    criminogenicNeed: string
    criminogenicNeedDesc: string


    constructor(needsData: string[]) {
        this.criminogenicNeed = needsData[0]
        this.criminogenicNeedDesc = needsData[1]
    }

    static query(objectivePk: string): string {

        return `select c.criminogenic_need_elm, r.ref_element_desc
                    from eor.ssp_crim_need_obj_pivot c, eor.ref_element r
                    where c.ssp_objectives_in_set_pk = ${objectivePk}
                    and r.ref_category_code = c.criminogenic_need_cat and r.ref_element_code = c.criminogenic_need_elm`
    }
}

export class DbAction {

    action: string
    actionDesc: string
    actionComment: string


    constructor(actionData: string[]) {

        this.action = actionData[0]
        this.actionDesc = actionData[1]
        this.actionComment = actionData[2]
    }

    static query(objectivePk: string): string {

        return `select i.intervention_elm, r.ref_element_desc, i.intervention_comment
                    from eor.ssp_intervention_in_set i, eor.ssp_obj_intervene_pivot p, eor.ref_element r
                    where p.ssp_intervention_in_set_pk = i.ssp_intervention_in_set_pk
                    and p.ssp_objectives_in_set_pk = ${objectivePk}
                    and r.ref_category_code = i.intervention_cat and r.ref_element_code = i.intervention_elm`
    }
}

const assessmentColumns: Columns = {

    assessmentPk: { table: '', name: 'oasys_set_pk', type: 'integer' },
    assessmentType: { table: '', name: 'ref_ass_version_code', type: 'string' },
    assessmentVersion: { table: '', name: 'version_number', type: 'integer' },
    status: { table: '', name: 'assessment_status_elm', type: 'string' },
    initiationDate: { table: '', name: 'initiation_date', type: 'date' },
    completedDate: { table: '', name: 'date_completed', type: 'date' },
    lastUpdatedDate: { table: 'oasys_set_change', name: 'lastupd_date', type: 'date' },
    cmsEventNumber: { table: '', name: 'cms_event_number', type: 'integer' },

    dateOfBirth: { table: '', name: 'date_of_birth', type: 'date' },
    assessorName: { table: '', name: 'assessor_name', type: 'string' },
    pOAssessment: { table: '', name: 'purpose_assessment_elm', type: 'string' },
    pOAssessmentDesc: { table: '', name: 'purpose_assmt_other_ftxt', type: 'string' },
    parentAssessmentPk: { table: '', name: 'parent_oasys_set_pk', type: 'integer' },
    signedDate: { table: '', name: 'assessor_signed_date', type: 'date' },
    sanIndicator: { table: '', name: 'san_assessment_linked_ind', type: 'string' },
    roshLevel: { table: '', name: 'rosh_level_elm', type: 'string' },
    learningToolScore: { table: '', name: 'learning_tool_score', type: 'integer' },
    ldcSubTotal: { table: '', name: 'ldc_sub_total', type: 'integer' },
    ldcFuncProc: { table: '', name: 'ldc_func_proc', type: 'string' },
}

const rsrColumns: Columns = {

    assessmentPk: { table: '', name: 'offender_rsr_scores_pk', type: 'integer' },
    status: { table: '', name: 'rsr_status', type: 'string' },
    initiationDate: { table: '', name: 'initiation_date', type: 'date' },
    completedDate: { table: '', name: 'date_completed', type: 'date' },
    lastUpdatedDate: { table: '', name: 'lastupd_date', type: 'date' },
}

const riskColumns: Columns = {

    ogrs31Year: { table: '', name: 'ogrs3_1year', type: 'integer' },
    ogrs32Year: { table: '', name: 'ogrs3_2year', type: 'integer' },
    ogrs3RiskRecon: { table: '', name: 'ogrs3_risk_recon_elm', type: 'string' },

    ospImagePercentageScore: { table: '', name: 'osp_i_percentage_score', type: 'float' },
    ospIRisk: { table: '', name: 'osp_i_risk_recon_elm', type: 'string' },
    ospContactPercentageScore: { table: '', name: 'osp_c_percentage_score', type: 'float' },
    ospCRisk: { table: '', name: 'osp_c_risk_recon_elm', type: 'string' },

    ospIicPercentageScore: { table: '', name: 'osp_iic_percentage_score', type: 'float' },
    ospIicRisk: { table: '', name: 'osp_iic_risk_recon_elm', type: 'string' },
    ospDcPercentageScore: { table: '', name: 'osp_dc_percentage_score', type: 'float' },
    ospDcRisk: { table: '', name: 'osp_dc_risk_recon_elm', type: 'string' },
    ospCRiskReduction: { table: '', name: 'osp_c_risk_reduction', type: 'string' },

    ogrs4gPercentageScore: { table: '', name: 'ogrs4g_percentage_2yr', type: 'float' },
    ogrs4gRisk: { table: '', name: 'ogrs4g_band_risk_recon_elm', type: 'string' },
    ogrs4gCalculated: { table: '', name: 'ogrs4g_calculated', type: 'string' },
    ogp2PercentageScore: { table: '', name: 'ogp2_percentage_2yr', type: 'float' },
    ogp2Risk: { table: '', name: 'ogp2_band_risk_recon_elm', type: 'string' },
    ogp2Calculated: { table: '', name: 'ogp2_calculated', type: 'string' },

    ogrs4vPercentageScore: { table: '', name: 'ogrs4v_percentage_2yr', type: 'float' },
    ogrs4vRisk: { table: '', name: 'ogrs4v_band_risk_recon_elm', type: 'string' },
    ogrs4vCalculated: { table: '', name: 'ogrs4v_calculated', type: 'string' },
    ovp2PercentageScore: { table: '', name: 'ovp2_percentage_2yr', type: 'float' },
    ovp2Risk: { table: '', name: 'ovp2_band_risk_recon_elm', type: 'string' },
    ovp2Calculated: { table: '', name: 'ovp2_calculated', type: 'string' },

    snsvStaticCalculated: { table: '', name: 'snsv_calculated_static', type: 'string' },
    snsvStaticPercentageScore: { table: '', name: 'snsv_percentage_2yr_static', type: 'float' },
    snsvStaticRisk: { table: '', name: 'snsv_stat_band_risk_recon_elm', type: 'string' },
    snsvDynamicCalculated: { table: '', name: 'snsv_calculated_dynamic', type: 'string' },
    snsvDynamicPercentageScore: { table: '', name: 'snsv_percentage_2yr_dynamic', type: 'float' },
    snsvDynamicRisk: { table: '', name: 'snsv_dyn_band_risk_recon_elm', type: 'string' },

    rsrStaticOrDynamic: { table: '', name: 'rsr_static_or_dynamic', type: 'string' },
    rsrExceptionError: { table: '', name: 'rsr_exception_error', type: 'string' },
    rsrAlgorithmVersion: { table: '', name: 'rsr_algorithm_version', type: 'integer' },
    rsrPercentageScore: { table: '', name: 'rsr_percentage_score', type: 'float' },
    rsrRisk: { table: '', name: 'rsr_risk_recon_elm', type: 'string' },
}

const riskColumnsAssessmentOnly: Columns = {

    ogpStWesc: { table: '', name: 'ogp_st_wesc', type: 'integer' },
    ogpDyWesc: { table: '', name: 'ogp_dy_wesc', type: 'integer' },
    ogpTotWesc: { table: '', name: 'ogp_tot_wesc', type: 'integer' },
    ogp1Year: { table: '', name: 'ogp_1year', type: 'integer' },
    ogp2Year: { table: '', name: 'ogp_2year', type: 'integer' },
    ogpRisk: { table: '', name: 'ogp_risk_recon_elm', type: 'string' },

    ovpStWesc: { table: '', name: 'ovp_st_wesc', type: 'integer' },
    ovpDyWesc: { table: '', name: 'ovp_dy_wesc', type: 'integer' },
    ovpTotWesc: { table: '', name: 'ovp_tot_wesc', type: 'integer' },
    ovp1Year: { table: '', name: 'ovp_1year', type: 'integer' },
    ovp2Year: { table: '', name: 'ovp_2year', type: 'integer' },
    ovpRisk: { table: '', name: 'ovp_risk_recon_elm', type: 'string' },
    ovpPrevWesc: { table: '', name: 'ovp_prev_wesc', type: 'integer' },
    ovpNonVioWesc: { table: '', name: 'ovp_non_vio_wesc', type: 'integer' },
    ovpAgeWesc: { table: '', name: 'ovp_age_wesc', type: 'integer' },
    ovpVioWesc: { table: '', name: 'ovp_vio_wesc', type: 'integer' },
    ovpSexWesc: { table: '', name: 'ovp_sex_wesc', type: 'integer' },
}