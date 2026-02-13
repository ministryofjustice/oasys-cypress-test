import { Tier } from '../../../../oasys/ogrs/types'
import { TieringCase } from './dbClasses'
import { OasysDateTime } from 'lib/dateTime'


export function testTieringCaseNew(tieringCase: TieringCase, logText: string[]): Tier {

    const rosh = (tieringCase.rosh == null) ? tieringCase.roshLevelElm : tieringCase.rosh
    const arpRisk = tieringCase.arpCsrp.ogp2Percentage2yr == null ? tieringCase.arpCsrp.ogrs4gPercentage2yr : tieringCase.arpCsrp.ogp2Percentage2yr
    const ospContactRisk = tieringCase.srp.ncOspDcPercentageScore == null ? tieringCase.oldOsp.ospCPercentageScore : tieringCase.srp.ncOspDcPercentageScore
    const ospContactBand = tieringCase.srp.ncOspDcRiskReconElm == null ? tieringCase.oldOsp.ospCRiskReconElm : tieringCase.srp.ncOspDcRiskReconElm
    const ospImageBand = tieringCase.srp.ncOspIicRiskReconElm == null ? tieringCase.oldOsp.ospIRiskReconElm : tieringCase.srp.ncOspIicRiskReconElm

    const cpCombined = tieringCase.cp.cpRegistered == 'Y' || tieringCase.cp.barredChildren == 'Y' || tieringCase.cp.childSexExploitHist == 'Y' ||
        tieringCase.cp.altBarredChildren == 'Y' || tieringCase.cp.childCrimExploit == 'Y' || tieringCase.cp.childSexExploit == 'Y' ||
        tieringCase.cp.childConcerns == 'Y' || tieringCase.cp.riskToChildren == 'Y' || tieringCase.cp.childProtection == 'Y'

    const arpCsrp = calculateArpCsrp(arpRisk, tieringCase.arpCsrp.ncRsrPercentageScore)
    const arp = calculateArpCsrp(arpRisk, 0)
    const dc = calculateDc(ospContactRisk, ospContactBand, tieringCase.srp.ncOspDcPercentageScore == null)
    const iic = calculateIic(ospImageBand)
    const roshMappa = calculateRoshMappa(rosh, tieringCase.mappa)
    const lifer = calculateLifer(tieringCase.lifer, tieringCase.custodyInd, tieringCase.communityDate, tieringCase.dateCompleted)
    const daStalkingCp = calculateDaStalkingCp(tieringCase.daStalking.stalking == 'Y', tieringCase.daStalking.da == 'Y', tieringCase.daStalking.daHistory == 'Y', cpCombined)

    // Combine all the results
    let finalTier = arpCsrp

    let iicTrump = false
    if (tierNumbers[dc] >= tierNumbers[iic] && dc != null) {       // DC overrules ARP-CSRP only if higher
        finalTier = getHigherTier(arpCsrp, dc)
    } else if (dc != null && iic != null) {
        finalTier = getHigherTier(arp, iic)          // IIC wins if it's higher than DC, and compares to ARP only
        iicTrump = true
    }

    finalTier = getHigherTier(finalTier, roshMappa)
    finalTier = getHigherTier(finalTier, lifer)
    finalTier = getHigherTier(finalTier, daStalkingCp)

    if (arpCsrp == null && finalTier != 'A' && !iicTrump) {  // If no CSRP, only accept the final result if it's A or if IIC was used with ARP
        finalTier = null
    }

    logText.push(`        ARP/CSRP   - ${arpCsrp}`)
    logText.push(`        ARP        - ${arp}`)
    logText.push(`        DC-SRP     - ${dc}`)
    logText.push(`        IIC-SRP    - ${iic}`)
    logText.push(`        RoSH/MAPPA - ${roshMappa}`)
    logText.push(`        Lifer      - ${lifer}`)
    logText.push(`        DA, st, CP - ${daStalkingCp}`)

    return finalTier
}

function calculateArpCsrp(arp: number, csrp: number): Tier {

    if (arp == null || csrp == null) {
        return null
    }
    const arpCol =
        arp >= 90 ? 1
            : arp >= 75 ? 2
                : arp >= 50 ? 3
                    : arp >= 25 ? 4
                        : arp >= 15 ? 5
                            : 6

    const csrpRow =
        csrp >= 6.9 ? 1
            : csrp >= 3 ? 2
                : csrp >= 1 ? 3
                    : csrp >= 0.5 ? 4
                        : 5

    switch (csrpRow) {
        case 1:
            return arpCol <= 2 ? 'A' : 'B Upper'
        case 2:
            return arpCol == 1 ? 'A' : arpCol == 2 ? 'B Upper' : 'B Lower'
        case 3:
            return arpCol == 1 ? 'B Upper' : arpCol == 2 ? 'B Lower' : arpCol == 3 ? 'C Upper' : 'C Lower'
        case 4:
            return arpCol == 1 ? 'B Lower' : arpCol == 2 ? 'C Upper' : arpCol <= 4 ? 'C Lower' : 'D'
        case 5:
            return arpCol <= 2 ? 'C Upper' : arpCol == 3 ? 'C Lower' : arpCol <= 5 ? 'D' : 'E'
    }
}

function calculateDc(ospRisk: number, ospContactBand: string, oldPercentageBands: boolean): Tier {

    if (ospRisk == null || ospContactBand == null) {
        return null
    }

    const topMediumReduced = oldPercentageBands ? 2 : 3.36
    const bottomMediumReduced = oldPercentageBands ? 1.37 : 2.11
    const topMediumStd = oldPercentageBands ? 0.82 : 1.12

    switch (ospContactBand.substring(0, 1)) {
        case 'V':
            return 'A'
        case 'H':
            return 'B Upper'
        case 'M':
            if (ospRisk >= topMediumReduced) {
                return 'B Lower'
            }
            if (ospRisk >= bottomMediumReduced) {
                return 'C Upper'
            }
            if (ospRisk >= topMediumStd) {
                return 'B Lower'
            }
            return 'C Upper'
        case 'L':
            return 'C Lower'
    }
    return null
}

function calculateIic(ospBand: string): Tier {

    if (ospBand == null) {
        return null
    }

    const band = ospBand.substring(0, 1)
    return band == 'H' ? 'B Lower' : band == 'M' ? 'C Upper' : band == 'L' ? 'C Lower' : null
}

function calculateRoshMappa(rosh: string, mappa: string): Tier {

    if (rosh == null) {
        return null
    }
    if (mappa == 'Y') {
        switch (rosh) {
            case 'V':
                return 'A'
            case 'H':
                return 'B Lower'
            case 'M':
                return 'C Upper'
            case 'L':
                return 'C Lower'
        }
    } else {
        return rosh == 'V' ? 'B Lower' : rosh == 'H' ? 'C Upper' : null
    }
}

function calculateLifer(lifer: string, custodyInd: string, communityDate: string, completionDate: string): Tier {

    if (lifer != 'Y' || custodyInd == 'Y' || communityDate == null || completionDate == null) {
        return null
    }

    if (OasysDateTime.dateDiffString(completionDate, communityDate, 'day') > 0) { // Community date is in the future
        return null
    }

    const diffYears = OasysDateTime.dateDiffString(communityDate, completionDate, 'year') // Assessment date minus community date
    return diffYears >= 1 ? 'D' : 'B Upper'
}

function calculateDaStalkingCp(stalking: boolean, da: boolean, daHistory: boolean, cp: boolean): Tier {

    return da || daHistory ? 'C Lower' : stalking || cp ? 'D' : null
}

function getHigherTier(t1: Tier, t2: Tier): Tier {
    if (t1 == null && t2 == null) {
        return null
    }
    if (t1 == null) {
        return t2
    }
    if (t2 == null) {
        return t1
    }
    return tierNumbers[t1] > tierNumbers[t2] ? t1 : t2
}


const tierNumbers = {
    'A': 7,
    'B Upper': 6,
    'B Lower': 5,
    'C Upper': 4,
    'C Lower': 3,
    'D': 2,
    'E': 1,
}
