/**
 * Classes used to extract data from the OASys database for use in API regression testing.
 * These objects are created by the RestDb functions in cypress/support/restApidb.ts using the queries defined here.
 */

import { OasysDateTime } from 'oasys'


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
    eventNumber: number
    appVersion: string

    constructor(assessmentPk: number, assessmentType: string, status: string, initiationDate: string, signedDate: string,
        completedDate: string, lastUpdatedDate: string, assessmentVersion: number, versionTable: string[][]) {

        this.assessmentPk = assessmentPk
        this.assessmentType = assessmentType
        this.assessmentVersion = assessmentVersion
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
    qaData: string[][]
    textData: string[][]

    constructor(assessmentData: string[], versionTable: string[][]) {

        super(Number.parseInt(assessmentData[0]), assessmentData[1], assessmentData[2], assessmentData[3], assessmentData[4],
            assessmentData[5], assessmentData[6], Number.parseInt(assessmentData[41]), versionTable)
        this.riskDetails = new DbRiskDetails(assessmentData)
        this.roshLevel = assessmentData[36]
        this.eventNumber = getDbInt(assessmentData[37])
        this.pOAssessment = assessmentData[38]
        this.pOAssessmentDesc = assessmentData[39]
        this.assessorName = assessmentData[40]
        this.parentAssessmentPk = Number.parseInt(assessmentData[42]) || null
        this.sanIndicator = assessmentData[48]

        this.dateOfBirth = assessmentData[67]
        this.learningToolScore = assessmentData[68] == null ? null : Number.parseInt(assessmentData[68])
        this.ldcSubTotal = assessmentData[69] == null ? null : Number.parseInt(assessmentData[69])
        this.ldcFuncProc = assessmentData[70]
    }

    addCourtDetails(courtData: string[]) {

        this.courtCode = courtData[0]
        this.courtName = courtData[1]
        this.courtType = courtData[2]
    }

    static query(offenderPk: number): string {

        let query = 'select '
        query = query.concat(getColumns(commonColumnsAssessment, 'os'))
        query = query.concat(getColumns(riskColumns, 'os'))
        query = query.concat(getColumns(assessmentColumns, 'os')).slice(0, -1).concat(' \n') // remove last comma}

        return query.concat(
            `from eor.oasys_assessment_group oag, eor.oasys_set os, eor.oasys_set_change osc 
                    where oag.offender_pk = ${offenderPk} and oag.oasys_assessment_group_pk = os.oasys_assessment_group_pk 
                    and osc.oasys_set_pk = os.oasys_set_pk 
                    and os.deleted_date is null
                    order by os.initiation_date`)
    }

    static courtQuery(assessmentPk: number): string {

        return `select c.court_code, c.court_name, c.court_type_elm 
                    from eor.court c, eor.offence_block o 
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT' 
                    and c.court_pk = o.court_pk`
    }

    static qaQuery(assessmentPk: number): string {

        return `select q.ref_section_code, q.ref_question_code, ra.ref_section_answer
                    from eor.oasys_set st
                    left outer join eor.oasys_section s
                    on s.oasys_set_pk = st.oasys_set_pk
                    left outer join eor.oasys_question q
                    on q.oasys_section_pk = s.oasys_section_pk
                    left outer join eor.oasys_answer a
                    on a.oasys_question_pk = q.oasys_question_pk
                    left outer join eor.ref_answer ra
                    on (ra.ref_ass_version_code = a.ref_ass_version_code
                    and ra.version_number = a.version_number
                    and ra.ref_section_code = a.ref_section_code
                    and ra.ref_question_code = a.ref_question_code
                    and ra.ref_answer_code = a.ref_answer_code )
                    where st.oasys_set_pk = ${assessmentPk}
                    and q.currently_hidden_ind = 'N'
                    and a.ref_answer_code is not null
                    order by q.ref_section_code, q.ref_question_code`

    }

    static textAnswerQuery(assessmentPk: number): string {

        return `select q.ref_section_code, q.ref_question_code, q.free_format_answer, q.additional_note
                    from eor.oasys_set st
                    left outer join eor.oasys_section s on s.oasys_set_pk = st.oasys_set_pk
                    left outer join eor.oasys_question q on q.oasys_section_pk = s.oasys_section_pk
                    where st.oasys_set_pk = ${assessmentPk}
                    and q.currently_hidden_ind = 'N'`
    }
}

/**
 * Standalone RSR assessments
 */
export class DbRsr extends DbAssessmentOrRsr {

    constructor(rsrData: string[], versionTable: string[][]) {

        super(Number.parseInt(rsrData[0]), 'STANDALONE', rsrData[1], rsrData[2], undefined, rsrData[3], rsrData[4], null, versionTable)
        this.riskDetails = new DbRiskDetails(rsrData, true)
        this.eventNumber = null
    }

    static query(offenderPk: number): string {

        return `select r.offender_rsr_scores_pk, r.rsr_status, to_char(r.initiation_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                            to_char(r.date_completed, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                            to_char(r.lastupd_date, 'YYYY-MM-DD\"T\"HH24:MI:SS'), 
                            r.ogrs3_1year, r.ogrs3_2year, r.ogrs3_risk_recon_elm, r.rsr_static_or_dynamic, 
                            r.rsr_exception_error, 
                            r.rsr_algorithm_version, r.rsr_percentage_score, r.rsr_risk_recon_elm, 
                            r.osp_i_percentage_score, r.osp_c_percentage_score, r.osp_i_risk_recon_elm, r.osp_c_risk_recon_elm,
                            r.osp_iic_risk_recon_elm, r.osp_iic_percentage_score, r.osp_dc_risk_recon_elm, r.osp_dc_percentage_score, r.osp_c_risk_reduction,
                            r.ogrs4g_percentage_2yr, r.ogrs4g_band_risk_recon_elm, r.ogrs4g_calculated, 
                            r.ogrs4v_percentage_2yr, r.ogrs4v_band_risk_recon_elm, r.ogrs4v_calculated, 
                            r.ogp2_percentage_2yr, r.ogp2_band_risk_recon_elm, r.ogp2_calculated, 
                            r.ovp2_percentage_2yr, r.ovp2_band_risk_recon_elm, r.ovp2_calculated, 
                            r.snsv_percentage_2yr_static, r.snsv_stat_band_risk_recon_elm, r.snsv_calculated_static, 
                            r.snsv_percentage_2yr_dynamic, r.snsv_dyn_band_risk_recon_elm, r.snsv_calculated_dynamic   
                            from eor.offender_rsr_scores r 
                            where r.offender_pk = ${offenderPk} 
                            and r.deleted_date is null 
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
    rsrRisk: string

    ospImagePercentageScore: number = 0
    ospContactPercentageScore: number = 0
    ospIRisk: string = 'NA'
    ospCRisk: string = 'NA'

    ospIicRisk: string
    ospIicPercentageScore: number
    ospDcRisk: string
    ospDcPercentageScore: number
    ospCRiskReduction: string

    ogrs4gPercentageScore: number
    ogrs4gRisk: string
    ogrs4gCalculated: string
    ogrs4vPercentageScore: number
    ogrs4vRisk: string
    ogrs4vCalculated: string
    ogp2PercentageScore: number
    ogp2Risk: string
    ogp2Calculated: string
    ovp2PercentageScore: number
    ovp2Risk: string
    ovp2Calculated: string
    snsvStaticPercentageScore: number
    snsvStaticRisk: string
    snsvStaticCalculated: string
    snsvDynamicPercentageScore: number
    snsvDynamicRisk: string
    snsvDynamicCalculated: string

    constructor(riskData: string[], standaloneRsr: boolean = false) {


        if (standaloneRsr) {
            let i = 5
            this.ogrs31Year = getDbInt(riskData[i++])
            this.ogrs32Year = getDbInt(riskData[i++])
            this.ogrs3RiskRecon = riskData[i++]

            this.rsrStaticOrDynamic = riskData[i++]
            this.rsrExceptionError = riskData[i++]
            this.rsrAlgorithmVersion = getDbInt(riskData[i++])
            this.rsrPercentageScore = getDbFloat(riskData[i++])
            this.rsrRisk = riskData[i++]
            this.ospImagePercentageScore = getDbFloat(riskData[i++])
            this.ospContactPercentageScore = getDbFloat(riskData[i++])
            this.ospIRisk = riskData[i++]
            this.ospCRisk = riskData[i++]

            this.ospIicRisk = riskData[i++]
            this.ospIicPercentageScore = getDbFloat(riskData[i++])
            this.ospDcRisk = riskData[i++]
            this.ospDcPercentageScore = getDbFloat(riskData[i++])
            this.ospCRiskReduction = riskData[i++]

            this.ogrs4gPercentageScore = getDbFloat(riskData[i++])
            this.ogrs4gRisk = riskData[i++]
            this.ogrs4gCalculated = riskData[i++]
            this.ogrs4vPercentageScore = getDbFloat(riskData[i++])
            this.ogrs4vRisk = riskData[i++]
            this.ogrs4vCalculated = riskData[i++]
            this.ogp2PercentageScore = getDbFloat(riskData[i++])
            this.ogp2Risk = riskData[i++]
            this.ogp2Calculated = riskData[i++]
            this.ovp2PercentageScore = getDbFloat(riskData[i++])
            this.ovp2Risk = riskData[i++]
            this.ovp2Calculated = riskData[i++]
            this.snsvStaticPercentageScore = getDbFloat(riskData[i++])
            this.snsvStaticRisk = riskData[i++]
            this.snsvStaticCalculated = riskData[i++]
            this.snsvDynamicPercentageScore = getDbFloat(riskData[i++])
            this.snsvDynamicRisk = riskData[i++]
            this.snsvDynamicCalculated = riskData[i++]
        } else {
            let i = 7
            this.ogpStWesc = getDbInt(riskData[i++])
            this.ogpDyWesc = getDbInt(riskData[i++])
            this.ogpTotWesc = Number.parseInt(riskData[i++]) || null
            this.ogp1Year = getDbInt(riskData[i++])
            this.ogp2Year = getDbInt(riskData[i++])
            this.ogpRisk = riskData[i++]

            this.ovpStWesc = getDbInt(riskData[i++])
            this.ovpDyWesc = getDbInt(riskData[i++])
            this.ovpTotWesc = Number.parseInt(riskData[i++]) || null
            this.ovp1Year = getDbInt(riskData[i++])
            this.ovp2Year = getDbInt(riskData[i++])
            this.ovpRisk = riskData[i++]
            this.ovpPrevWesc = getDbInt(riskData[i++])
            this.ovpNonVioWesc = getDbInt(riskData[i++])
            this.ovpAgeWesc = getDbInt(riskData[i++])
            this.ovpVioWesc = getDbInt(riskData[i++])
            this.ovpSexWesc = getDbInt(riskData[i++])

            this.ogrs31Year = getDbInt(riskData[i++])
            this.ogrs32Year = getDbInt(riskData[i++])
            this.ogrs3RiskRecon = riskData[i++]

            this.rsrStaticOrDynamic = riskData[i++]
            this.rsrExceptionError = riskData[i++]
            this.rsrAlgorithmVersion = getDbInt(riskData[i++])
            this.rsrPercentageScore = getDbFloat(riskData[i++])
            this.rsrRisk = riskData[i++]

            this.ospImagePercentageScore = getDbFloat(riskData[i++])
            this.ospContactPercentageScore = getDbFloat(riskData[i++])
            this.ospIRisk = riskData[i++]
            this.ospCRisk = riskData[i++]

            i = 43
            this.ospIicRisk = riskData[i++]
            this.ospIicPercentageScore = getDbFloat(riskData[i++])
            this.ospDcRisk = riskData[i++]
            this.ospDcPercentageScore = getDbFloat(riskData[i++])
            this.ospCRiskReduction = riskData[i++]

            i = 49
            this.ogrs4gPercentageScore = getDbFloat(riskData[i++])
            this.ogrs4gRisk = riskData[i++]
            this.ogrs4gCalculated = riskData[i++]
            this.ogrs4vPercentageScore = getDbFloat(riskData[i++])
            this.ogrs4vRisk = riskData[i++]
            this.ogrs4vCalculated = riskData[i++]
            this.ogp2PercentageScore = getDbFloat(riskData[i++])
            this.ogp2Risk = riskData[i++]
            this.ogp2Calculated = riskData[i++]
            this.ovp2PercentageScore = getDbFloat(riskData[i++])
            this.ovp2Risk = riskData[i++]
            this.ovp2Calculated = riskData[i++]
            this.snsvStaticPercentageScore = getDbFloat(riskData[i++])
            this.snsvStaticRisk = riskData[i++]
            this.snsvStaticCalculated = riskData[i++]
            this.snsvDynamicPercentageScore = getDbFloat(riskData[i++])
            this.snsvDynamicRisk = riskData[i++]
            this.snsvDynamicCalculated = riskData[i++]

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
        this.otherWeightedScore = l31 ? getDbInt(sectionData[2]) : null
        this.lowScoreNeedsAttn = sectionData[3]
        this.crimNeedScoreThreshold = getDbInt(sectionData[4])
        this.sanCrimNeedScore = san ? getDbInt(sectionData[5]) : null
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

function getVersionNumber(initiationDate: string, versionTable: string[][]) {
    for (let i in versionTable) {
        if (initiationDate >= versionTable[i][1]) return versionTable[i][0]
    }
    return 'unknown version'
}

function getDbInt(dbValue: string): number {
    return Number.isNaN(Number.parseInt(dbValue)) ? null : Number.parseInt(dbValue)
}

function getDbFloat(dbValue: string): number {
    return Number.isNaN(Number.parseFloat(dbValue)) ? null : Number.parseFloat(dbValue)
}

type Table = '' | 'oag' | 'osc'
type ColumnType = 'date' | 'integer' | 'float' | 'string'
type ColumnDef = { table: Table, name: string, type: ColumnType }
type Columns = { [keys: string]: ColumnDef }
// oag - oasys_assessment_group, osc = oasys_set_change.  Blank for default (oasys_set or offender_rsr_scores)

function getColumns(columns: Columns, defaultTable: string): string {

    let result = ''
    Object.keys(columns).forEach((key) => {
        result = result.concat(column(columns[key], defaultTable))
    })
    return result
}

function column(column: ColumnDef, defaultTable: string): string {

    let table = column.table == '' ? defaultTable : column.table

    return column.type == 'date'
        ? `to_char(${table}.${column.name}, '${OasysDateTime.oracleTimestampFormat}'),`
        : `${table}.${column.name},`
}

function assignValues(obj: {}, columns: Columns, data: string[], startIndex: number) {

    let i = startIndex
    Object.keys(columns).forEach((key) => {
        const column = columns[key]
        switch (column.type) {
            case 'date':
                break
            case 'float':
                break
            case 'integer':
                break
            case 'string':
                obj[key] = data[i++]
        }
    })
}

const commonColumnsAssessment: Columns = {

    assessmentPk: { table: '', name: 'oasys_set_pk', type: 'integer' },
    assessmentType: { table: '', name: 'ref_ass_version_code', type: 'string' },
    assessmentVersion: { table: '', name: 'version_number', type: 'integer' },
    status: { table: '', name: 'assessment_status_elm', type: 'string' },
    initiationDate: { table: '', name: 'initiation_date', type: 'date' },
    completedDate: { table: '', name: 'date_completed', type: 'date' },
    lastUpdatedDate: { table: 'osc', name: 'lastupd_date', type: 'date' },
    cmsEventNumber: { table: '', name: 'cms_event_number', type: 'integer' },
}

const assessmentColumns: Columns = {

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

const riskColumns: Columns = {

    ogrs31Year: { table: '', name: 'ogrs3_1year', type: 'integer' },
    ogrs32Year: { table: '', name: 'ogrs3_2year', type: 'integer' },
    ogrs3RiskRecon: { table: '', name: 'ogrs3_risk_recon_elm', type: 'string' },

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

    snsvCalculatedStatic: { table: '', name: 'snsv_calculated_static', type: 'string' },
    snsvStaticPercentageScore: { table: '', name: 'snsv_percentage_2yr_static', type: 'float' },
    snsvStaticRisk: { table: '', name: 'snsv_stat_band_risk_recon_elm', type: 'string' },
    snsvCalculatedDynamic: { table: '', name: 'snsv_calculated_dynamic', type: 'string' },
    snsvDynamicPercentageScore: { table: '', name: 'snsv_percentage_2yr_dynamic', type: 'float' },
    snsvDynamicRisk: { table: '', name: 'snsv_dyn_band_risk_recon_elm', type: 'string' },

    rsrStaticOrDynamic: { table: '', name: 'rsr_static_or_dynamic', type: 'string' },
    rsrExceptionError: { table: '', name: 'rsr_exception_error', type: 'string' },
    rsrAlgorithmVersion: { table: '', name: 'rsr_algorithm_version', type: 'integer' },
    rsrPercentageScore: { table: '', name: 'rsr_percentage_score', type: 'float' },
    rsrRisk: { table: '', name: 'rsr_risk_recon_elm', type: 'string' },


}