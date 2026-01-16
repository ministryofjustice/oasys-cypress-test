import { dateFormat } from "./tieringTest"

export class TieringCase {

    probationCrn: string
    prisonCrn: string
    assessmentPk: number
    dateCompleted: string
    rosh: string
    roshLevelElm: string
    ncRsrPercentageScore: number
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
    childProtection: string
    step1OgrsRsr: string
    dcsrpTier: string
    iicsrpTier: string
    finalTier: string
    custodyInd: string
    communityDate: string

    constructor(tieringData: string[]) {

        let i = 0
        this.probationCrn = tieringData[i++]
        this.prisonCrn = tieringData[i++]
        this.assessmentPk = Number.parseInt(tieringData[i++])
        this.dateCompleted = tieringData[i++]
        this.rosh = tieringData[i++]
        this.roshLevelElm = tieringData[i++]
        this.ncRsrPercentageScore = getDbFloat(tieringData[i++])
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
        this.childProtection = tieringData[i++]
        this.step1OgrsRsr = tieringData[i++]
        this.dcsrpTier = tieringData[i++]
        this.iicsrpTier = tieringData[i++]
        this.finalTier = tieringData[i++]
        this.custodyInd = tieringData[i++]
        this.communityDate = tieringData[i++]
    }

    static query(rows: number, whereClause: string): string {
        return `select 
                    cms_prob_number, cms_pris_number, oasys_set_pk, to_char(date_completed, '${dateFormat}'), rosh, rosh_level_elm,
                    nc_rsr_percentage_score, 
                    nc_osp_dc_risk_recon_elm, nc_osp_dc_percentage_score, nc_osp_iic_risk_recon_elm, nc_osp_iic_percentage_score, dc_srp_risk_reduction, 
                    ogrs4g_percentage_2yr, ogp2_percentage_2yr, 
                    mappa, lifer, stalking, da, da_history, cp_registered,  
                    step1_ogrs_rsr, dcsrp_tier, iicsrp_tier, final_tier,
                    custody_ind, to_char(community_date, '${dateFormat}')
                from eor.df453_new_prediction 
                    where ${whereClause} 
                    fetch first ${rows} rows only`
    }
}


function getDbFloat(dbValue: string): number {
    return Number.isNaN(Number.parseFloat(dbValue)) ? null : Number.parseFloat(dbValue)
}