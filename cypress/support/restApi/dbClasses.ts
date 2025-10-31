/**
 * Classes used to extract data from the OASys database for use in API regression testing.
 * These objects are created by the RestDb functions in cypress/support/restApidb.ts using the queries defined here.
 */


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

        this.offenderPk = Number.parseInt(offenderData[0])
        this.probationCrn = offenderData[1]
        this.nomisId = offenderData[2]
        this.riskToOthers = offenderData[3]
        this.limitedAccessOffender = offenderData[4] == 'Y'
        this.pnc = offenderData[5]
        this.forename1 = offenderData[6]
        this.surname = offenderData[7]
        this.gender = Number.parseInt(offenderData[8])
        this.custodyInd = offenderData[9]
    }

    static query(crnSource: Provider, crn: string): string {
        return `select offender_pk, cms_prob_number, cms_pris_number, risk_to_others_elm, limited_access_offender, 
                    pnc, forename_1, family_name, gender_elm, custody_ind
                    from offender where deleted_date is null 
                    and ${crnSource == 'prob' ? 'cms_prob_number' : 'cms_pris_number'} = '${crn}'`
    }
}

/**
 * Base class for assessments and standalone RSRs
 */
export class DbAssessmentOrRsr {

    assessmentPk: number
    assessmentType: string
    status: string
    initiationDate: string
    signedDate: string
    completedDate: string
    lastUpdatedDate: string
    riskDetails: DbRiskDetails
    eventNumber: number
    appVersion: string

    constructor(assessmentPk: number, assessmentType: string, status: string, initiationDate: string, signedDate: string, completedDate: string, lastUpdatedDate: string, versionTable: string[][]) {

        this.assessmentPk = assessmentPk
        this.assessmentType = assessmentType
        this.status = status
        this.initiationDate = initiationDate
        this.signedDate = signedDate
        this.completedDate = completedDate
        this.lastUpdatedDate = lastUpdatedDate
        this.appVersion = getVersionNumber(initiationDate, versionTable)
    }
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
    assessmentVersion: number
    courtCode: string
    courtType: string
    courtName: string
    parentAssessmentPk: number
    sanIndicator: string
    offences: DbOffence[] = []
    victims: DbVictim[] = []
    basicSentencePlan: DbBspObjective[] = []
    objectives: DbObjective[] = []

    sections: DbSection[] = []
    qaData: string[][]
    textData: string[][]

    constructor(assessmentData: string[], versionTable: string[][]) {

        super(Number.parseInt(assessmentData[0]), assessmentData[1], assessmentData[2], assessmentData[3], assessmentData[4], assessmentData[5], assessmentData[6], versionTable)
        this.riskDetails = new DbRiskDetails(assessmentData)
        this.roshLevel = assessmentData[36]
        this.eventNumber = Number.parseInt(assessmentData[37])
        this.pOAssessment = assessmentData[38]
        this.pOAssessmentDesc = assessmentData[39]
        this.assessorName = assessmentData[40]
        this.assessmentVersion = Number.parseInt(assessmentData[41])
        this.parentAssessmentPk = Number.parseInt(assessmentData[42]) || null
        this.sanIndicator = assessmentData[47]
    }

    addCourtDetails(courtData: string[]) {

        this.courtCode = courtData[0]
        this.courtName = courtData[1]
        this.courtType = courtData[2]
    }

    static query(crnSource: Provider, crn: string): string {

        return `select s.oasys_set_pk, s.ref_ass_version_code, s.assessment_status_elm,
                    to_char(s.initiation_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'),
                    to_char(s.assessor_signed_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'),
                    to_char(s.date_completed, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                    to_char(c.lastupd_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                    ogp_st_wesc, ogp_dy_wesc, ogp_tot_wesc, ogp_1year, ogp_2year, ogp_risk_recon_elm, 
                    ovp_st_wesc, ovp_dy_wesc, ovp_tot_wesc, ovp_1year, ovp_2year, ovp_risk_recon_elm, 
                    ovp_prev_wesc, ovp_non_vio_wesc, ovp_age_wesc, ovp_vio_wesc, ovp_sex_wesc, 
                    s.ogrs3_1year, s.ogrs3_2year, s.ogrs3_risk_recon_elm, s.rsr_static_or_dynamic, 
                    s.rsr_exception_error, 
                    s.rsr_algorithm_version, s.rsr_percentage_score, s.rsr_risk_recon_elm, 
                    s.osp_i_percentage_score, s.osp_c_percentage_score, s.osp_i_risk_recon_elm, s.osp_c_risk_recon_elm, s.rosh_level_elm,
                    s.cms_event_number, s.purpose_assessment_elm, s.purpose_assmt_other_ftxt, assessor_name, s.version_number, s.parent_oasys_set_pk, 
                    s.osp_iic_risk_recon_elm, s.osp_iic_percentage_score, s.osp_dc_risk_recon_elm, s.osp_dc_percentage_score,
                    s.san_assessment_linked_ind     
                    from offender o, oasys_assessment_group g, oasys_set s, oasys_set_change c 
                    where ${crnSource == 'prob' ? 'o.cms_prob_number' : 'o.cms_pris_number'} = '${crn}'
                    and o.offender_pk = g.offender_PK and g.oasys_assessment_group_PK = s.oasys_assessment_group_PK 
                    and c.oasys_set_pk = s.oasys_set_pk 
                    and s.deleted_date is null
                    order by s.initiation_date`
    }

    static courtQuery(assessmentPk: number): string {

        return `select c.court_code, c.court_name, c.court_type_elm 
                    from court c, offence_block o 
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT' 
                    and c.court_pk = o.court_pk`
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

/**
 * Standalone RSR assessments
 */
export class DbRsr extends DbAssessmentOrRsr {

    constructor(rsrData: string[], versionTable: string[][]) {

        super(Number.parseInt(rsrData[0]), 'STANDALONE', rsrData[1], rsrData[2], undefined, rsrData[3], rsrData[4], versionTable)
        this.riskDetails = new DbRiskDetails(rsrData, true)
        this.eventNumber = Number.parseInt(rsrData[17])
    }

    static query(crnSource: Provider, crn: string): string {

        return `select r.offender_rsr_scores_pk, r.rsr_status, to_char(r.initiation_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                            to_char(r.date_completed, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                            to_char(r.lastupd_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                            r.ogrs3_1year, r.ogrs3_2year, r.ogrs3_risk_recon_elm, r.rsr_static_or_dynamic, 
                            r.rsr_exception_error, 
                            r.rsr_algorithm_version, r.rsr_percentage_score, r.rsr_risk_recon_elm, 
                            r.osp_i_percentage_score, r.osp_c_percentage_score, r.osp_i_risk_recon_elm, r.osp_c_risk_recon_elm,
                            o.cms_event_number,
                            r.osp_iic_risk_recon_elm, r.osp_iic_percentage_score, r.osp_dc_risk_recon_elm, r.osp_dc_percentage_score  
                            from offender_rsr_scores r, offender o 
                            where r.offender_pk = o.offender_pk and ${crnSource == 'prob' ? 'o.cms_prob_number' : 'o.cms_pris_number'} = '${crn}' 
                            and o.deleted_date is null and r.deleted_date is null 
                            order by r.initiation_date`
    }
}

/**
 * Risk data from the oasys_set or standalone_rsr record
 */
export class DbRiskDetails {

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

    ogrs31Year: number
    ogrs32Year: number
    ogrs3RiskRecon: string

    rsrStaticOrDynamic: string
    rsrExceptionError: string
    rsrAlgorithmVersion: number
    rsrPercentageScore: number
    scoreLevel: string

    ospImagePercentageScore: number = 0
    ospContactPercentageScore: number = 0
    ospImageScoreLevel: string = 'NA'
    ospContactScoreLevel: string = 'NA'

    ospIndirectImagesChildrenScoreLevel: string
    ospIndirectImagesChildrenPercentageScore: number
    ospDirectContactScoreLevel: string
    ospDirectContactPercentageScore: number

    constructor(riskData: string[], standaloneRsr: boolean = false) {

        if (standaloneRsr) {
            this.ogrs31Year = getDbInt(riskData[5])
            this.ogrs32Year = getDbInt(riskData[6])
            this.ogrs3RiskRecon = riskData[7]

            this.rsrStaticOrDynamic = riskData[8]
            this.rsrExceptionError = riskData[9]
            this.rsrAlgorithmVersion = getDbInt(riskData[10])
            this.rsrPercentageScore = getDbFloat(riskData[11])
            this.scoreLevel = riskData[12]
            this.ospImagePercentageScore = getDbFloat(riskData[13])
            this.ospContactPercentageScore = getDbFloat(riskData[14])
            this.ospImageScoreLevel = riskData[15]
            this.ospContactScoreLevel = riskData[16]

            this.ospIndirectImagesChildrenScoreLevel = riskData[18]
            this.ospIndirectImagesChildrenPercentageScore = getDbFloat(riskData[19])
            this.ospDirectContactScoreLevel = riskData[20]
            this.ospDirectContactPercentageScore = getDbFloat(riskData[21])

        } else {
            this.ogpStWesc = getDbInt(riskData[7])
            this.ogpDyWesc = getDbInt(riskData[8])
            this.ogpTotWesc = Number.parseInt(riskData[9]) || null
            this.ogp1Year = getDbInt(riskData[10])
            this.ogp2Year = getDbInt(riskData[11])
            this.ogpRisk = riskData[12]

            this.ovpStWesc = getDbInt(riskData[13])
            this.ovpDyWesc = getDbInt(riskData[14])
            this.ovpTotWesc = Number.parseInt(riskData[15]) || null
            this.ovp1Year = getDbInt(riskData[16])
            this.ovp2Year = getDbInt(riskData[17])
            this.ovpRisk = riskData[18]
            this.ovpPrevWesc = getDbInt(riskData[19])
            this.ovpNonVioWesc = getDbInt(riskData[20])
            this.ovpAgeWesc = getDbInt(riskData[21])
            this.ovpVioWesc = getDbInt(riskData[22])
            this.ovpSexWesc = getDbInt(riskData[23])

            this.ogrs31Year = getDbInt(riskData[24])
            this.ogrs32Year = getDbInt(riskData[25])
            this.ogrs3RiskRecon = riskData[26]

            this.rsrStaticOrDynamic = riskData[27]
            this.rsrExceptionError = riskData[28]
            this.rsrAlgorithmVersion = getDbInt(riskData[29])
            this.rsrPercentageScore = getDbFloat(riskData[30])
            this.scoreLevel = riskData[31]

            this.ospImagePercentageScore = getDbFloat(riskData[32])
            this.ospContactPercentageScore = getDbFloat(riskData[33])
            this.ospImageScoreLevel = riskData[34]
            this.ospContactScoreLevel = riskData[35]

            this.ospIndirectImagesChildrenScoreLevel = riskData[43]
            this.ospIndirectImagesChildrenPercentageScore = getDbFloat(riskData[44])
            this.ospDirectContactScoreLevel = riskData[45]
            this.ospDirectContactPercentageScore = getDbFloat(riskData[46])
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
        return `select v.display_sort, ar.ref_element_desc, gr.ref_element_desc, er.ref_element_desc, rr.ref_element_desc from victim v
                        left outer join ref_element ar on v.age_of_victim_elm = ar.ref_element_code and ar.ref_category_code = 'AGE_OF_VICTIM'
                        left outer join ref_element gr on v.gender_elm = gr.ref_element_code and gr.ref_category_code = 'GENDER'
                        left outer join ref_element er on v.ethnic_category_elm = er.ref_element_code and er.ref_category_code = 'ETHNIC_CATEGORY'
                        left outer join ref_element rr on v.victim_relation_elm = rr.ref_element_code and rr.ref_category_code = 'VICTIM_PERPETRATOR_RELATIONSHIP'
                        where v.oasys_set_pk = ${assessmentPk}`
    }

}

export class DbSection {

    sectionCode: string
    sectionPk: number
    otherWeightedScore: number
    lowScoreNeedsAttn: string
    crimNeedScoreThreshold: number

    constructor(sectionData: string[]) {

        this.sectionCode = sectionData[0]
        this.sectionPk = Number.parseInt(sectionData[1])
        this.otherWeightedScore = getDbInt(sectionData[2])
        this.lowScoreNeedsAttn = sectionData[3]
        this.crimNeedScoreThreshold = getDbInt(sectionData[4])
    }

    static query(assessmentPk: number): string {

        return `select s.ref_section_code, s.oasys_section_pk, s.sect_other_weighted_score, s.low_score_need_attn_ind, r.crim_need_score_threshold
                    from oasys_section s, ref_section r 
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
                    from basic_sentence_plan_obj o, ref_element r
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
                    from ssp_objectives_in_set ois, ssp_objective so, objective o, ssp_objective_measure m, ref_element r 
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
                    from ssp_crim_need_obj_pivot c, ref_element r
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
                    from ssp_intervention_in_set i, ssp_obj_intervene_pivot p, ref_element r
                    where p.ssp_intervention_in_set_pk = i.ssp_intervention_in_set_pk
                    and p.ssp_objectives_in_set_pk = ${objectivePk}
                    and r.ref_category_code = i.intervention_cat and r.ref_element_code = i.intervention_elm`
    }
}

function getVersionNumber(initiationDate: string, versionTable: string[][]) {
    for (let i in versionTable) {
        if (initiationDate >= versionTable[i][1]) return versionTable[i][0]
    }
    return 'unknown version'
}

function getDbInt(dbValue: string): number {
    return  Number.isNaN(Number.parseInt(dbValue)) ? null : Number.parseInt(dbValue)
}

function getDbFloat(dbValue: string): number {
    return  Number.isNaN(Number.parseFloat(dbValue)) ? null : Number.parseFloat(dbValue)
}