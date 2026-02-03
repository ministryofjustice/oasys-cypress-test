import { dateFormat } from "./tieringTest"

export class TieringCase {

    probationCrn: string
    prisonCrn: string
    assessmentPk: number
    offenderPk: number
    dateCompleted: string
    rosh: string
    roshLevelElm: string
    ncRsrPercentageScore: number
    snsvStaticPercentage: number
    snsvDynamicPercentage: number
    ncOspDcRiskReconElm: string
    ncOspDcPercentageScore: number
    ncOspIicRiskReconElm: string
    ncOspIicPercentageScore: number
    dcSrpRiskReduction: string
    ogrs4gPercentage2yr: number
    ogp2Percentage2yr: number
    mappa: string
    lifer: string
    stalking: string
    da: string
    daHistory: string
    cpRegistered: string
    step1OgrsRsr: string
    dcsrpTier: string
    iicsrpTier: string
    finalTier: string
    alternativeTier: string
    custodyInd: string
    communityDate: string

    // Old OSP scores for fallback
    ospCRiskReconElm: string
    ospCPercentageScore: number
    ospIRiskReconElm: string
    ospIPercentageScore: number

    // Additional CP flags
    barredChildren: string
    childSexExploitHist: string
    altBarredChildren: string
    childCrimExploit: string
    childSexExploit: string
    childConcerns: string
    riskToChildren: string
    childProtection: string

    constructor(tieringData: string[]) {

        let i = 0
        this.probationCrn = tieringData[i++]
        this.prisonCrn = tieringData[i++]
        this.assessmentPk = Number.parseInt(tieringData[i++])
        this.offenderPk = Number.parseInt(tieringData[i++])
        this.dateCompleted = tieringData[i++]
        this.rosh = tieringData[i++]
        this.roshLevelElm = tieringData[i++]
        this.ncRsrPercentageScore = getDbFloat(tieringData[i++])
        this.snsvStaticPercentage = getDbFloat(tieringData[i++])
        this.snsvDynamicPercentage = getDbFloat(tieringData[i++])
        this.ncOspDcRiskReconElm = tieringData[i++]
        this.ncOspDcPercentageScore = getDbFloat(tieringData[i++])
        this.ncOspIicRiskReconElm = tieringData[i++]
        this.ncOspIicPercentageScore = getDbFloat(tieringData[i++])
        this.dcSrpRiskReduction = tieringData[i++]
        this.ogrs4gPercentage2yr = getDbFloat(tieringData[i++])
        this.ogp2Percentage2yr = getDbFloat(tieringData[i++])
        this.mappa = tieringData[i++]
        this.lifer = tieringData[i++]
        this.stalking = tieringData[i++]
        this.da = tieringData[i++]
        this.daHistory = tieringData[i++]
        this.cpRegistered = tieringData[i++]
        this.step1OgrsRsr = tieringData[i++]
        this.dcsrpTier = tieringData[i++]
        this.iicsrpTier = tieringData[i++]
        this.finalTier = tieringData[i++]
        this.alternativeTier = tieringData[i++]
        this.custodyInd = tieringData[i++]
        this.communityDate = tieringData[i++]

        this.ospCRiskReconElm = tieringData[i++]
        this.ospCPercentageScore = getDbFloat(tieringData[i++])
        this.ospIRiskReconElm = tieringData[i++]
        this.ospIPercentageScore = getDbFloat(tieringData[i++])

        this.barredChildren = tieringData[i++]
        this.childSexExploitHist = tieringData[i++]
        this.altBarredChildren = tieringData[i++]
        this.childCrimExploit = tieringData[i++]
        this.childSexExploit = tieringData[i++]
        this.childConcerns = tieringData[i++]
        this.riskToChildren = tieringData[i++]
        this.childProtection = tieringData[i++]
    }

    static query(rows: number, whereClause: string): string {
        return `select 
                    cms_prob_number, cms_pris_number, oasys_set_pk, offender_pk,
                    to_char(date_completed, '${dateFormat}'), rosh, rosh_level_elm, 
                    nc_rsr_percentage_score, snsv_percentage_2yr_static, snsv_percentage_2yr_dynamic,
                    nc_osp_dc_risk_recon_elm, nc_osp_dc_percentage_score, nc_osp_iic_risk_recon_elm, nc_osp_iic_percentage_score, dc_srp_risk_reduction, 
                    ogrs4g_percentage_2yr, ogp2_percentage_2yr, 
                    mappa, lifer, stalking, da, da_history, cp_registered,  
                    step1_ogrs_rsr, dcsrp_tier, iicsrp_tier, final_tier, alternative_tier,
                    custody_ind, to_char(community_date, '${dateFormat}'),
                    osp_c_risk_recon_elm, osp_c_percentage_score, osp_i_risk_recon_elm, osp_i_percentage_score,
                    barred_children, child_sex_exploit_hist, alt_barred_children, child_crim_exploit, 
                    child_sex_exploit, child_concerns, risk_to_children, child_protection
                from eor.df453_new_prediction 
                    where ${whereClause} 
                    fetch first ${rows} rows only`
    }
}


function getDbFloat(dbValue: string): number {
    return Number.isNaN(Number.parseFloat(dbValue)) ? null : Number.parseFloat(dbValue)
}