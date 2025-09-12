import * as common from './common'
import * as dbClasses from './dbClasses'

export class OGRS {

    ogrs31Year: number
    ogrs32Year: number
    ogrs3RiskRecon: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogrs31Year = dbRiskDetails.ogrs31Year
        this.ogrs32Year = dbRiskDetails.ogrs32Year
        this.ogrs3RiskRecon = common.riskLabel(dbRiskDetails.ogrs3RiskRecon)
    }
}

export class OGP {

    ogpStWesc: number
    ogpDyWesc: number
    ogpTotWesc: number
    ogp1Year: number
    ogp2Year: number
    ogpRisk: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogpStWesc = dbRiskDetails.ogpStWesc
        this.ogpDyWesc = dbRiskDetails.ogpDyWesc
        this.ogpTotWesc = dbRiskDetails.ogpTotWesc
        this.ogp1Year = dbRiskDetails.ogp1Year
        this.ogp2Year = dbRiskDetails.ogp2Year
        this.ogpRisk = common.riskLabel(dbRiskDetails.ogpRisk)
    }
}

export class OVP {

    ovpStWesc: number
    ovpDyWesc: number
    ovpTotWesc: number
    ovp1Year: number
    ovp2Year: number
    ovpRisk: string
    ovpPrevWesc: number
    ovpNonVioWesc: number
    ovpAgeWesc: number
    ovpVioWesc: number
    ovpSexWesc: number

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ovpStWesc = dbRiskDetails.ovpStWesc
        this.ovpDyWesc = dbRiskDetails.ovpDyWesc
        this.ovpTotWesc = dbRiskDetails.ovpTotWesc
        this.ovp1Year = dbRiskDetails.ovp1Year
        this.ovp2Year = dbRiskDetails.ovp2Year
        this.ovpRisk = common.riskLabel(dbRiskDetails.ovpRisk)
        this.ovpPrevWesc = dbRiskDetails.ovpPrevWesc
        this.ovpNonVioWesc = dbRiskDetails.ovpNonVioWesc
        this.ovpAgeWesc = dbRiskDetails.ovpAgeWesc
        this.ovpVioWesc = dbRiskDetails.ovpVioWesc
        this.ovpSexWesc = dbRiskDetails.ovpSexWesc
    }
}

export class RSR {

    rsrStaticOrDynamic: string
    rsrExceptionError: string
    rsrAlgorithmVersion: number
    rsrPercentageScore: number
    scoreLevel: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.rsrStaticOrDynamic = dbRiskDetails.rsrStaticOrDynamic
        this.rsrExceptionError = dbRiskDetails.rsrExceptionError
        this.rsrAlgorithmVersion = dbRiskDetails.rsrAlgorithmVersion
        this.rsrPercentageScore = fixDp(dbRiskDetails.rsrPercentageScore)
        this.scoreLevel = common.riskLabel(dbRiskDetails.scoreLevel)
    }
}

export class OSP {

    ospImagePercentageScore: number
    ospContactPercentageScore: number
    ospImageScoreLevel: string
    ospContactScoreLevel: string

    ospIndirectImagesChildrenScoreLevel: string
    ospIndirectImagesChildrenPercentageScore: number
    ospDirectContactScoreLevel: string
    ospDirectContactPercentageScore: number

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ospImagePercentageScore = fixDp(dbRiskDetails.ospImagePercentageScore)
        this.ospContactPercentageScore = fixDp(dbRiskDetails.ospContactPercentageScore)
        this.ospImageScoreLevel = common.riskLabel(dbRiskDetails.ospImageScoreLevel)
        this.ospContactScoreLevel = common.riskLabel(dbRiskDetails.ospContactScoreLevel)

        this.ospIndirectImagesChildrenScoreLevel = common.riskLabel(dbRiskDetails.ospIndirectImagesChildrenScoreLevel)
        this.ospIndirectImagesChildrenPercentageScore = fixDp(dbRiskDetails.ospIndirectImagesChildrenPercentageScore)
        this.ospDirectContactScoreLevel = common.riskLabel(dbRiskDetails.ospDirectContactScoreLevel)
        this.ospDirectContactPercentageScore = fixDp(dbRiskDetails.ospDirectContactPercentageScore)
    }
}


function fixDp(value: number): number {

    if (value == undefined || value == null) return value
    return Number(value.toFixed(2))
}