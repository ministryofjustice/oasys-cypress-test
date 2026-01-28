import dayjs from 'dayjs'

import { Tier } from '../types'
import { TieringCase } from './dbClasses'
import { dateFormat } from './tieringTest'


// Original process.  Step one uses CSRP but can be reduced by step 2.
export function testTieringCase(tieringCase: TieringCase, logText: string[]): Tier {

    const rosh = (tieringCase.rosh == null) ? tieringCase.roshLevelElm : tieringCase.rosh
    const arpRisk = tieringCase.ogp2Percentage2yr == null ? tieringCase.ogrs4gPercentage2yr : tieringCase.ogp2Percentage2yr
    const ospContactRisk = tieringCase.ncOspDcPercentageScore == null ? tieringCase.ospCPercentageScore : tieringCase.ncOspDcPercentageScore
    const ospContactBand = tieringCase.ncOspDcRiskReconElm == null ? tieringCase.ospCRiskReconElm : tieringCase.ncOspDcRiskReconElm
    const ospImageBand = tieringCase.ncOspIicRiskReconElm == null ? tieringCase.ospIRiskReconElm : tieringCase.ncOspIicRiskReconElm

    const cp = tieringCase.cpRegistered == 'Y' || tieringCase.barredChildren == 'Y' || tieringCase.childSexExploitHist == 'Y' ||
        tieringCase.altBarredChildren == 'Y' || tieringCase.childCrimExploit == 'Y' || tieringCase.childSexExploit == 'Y' ||
        tieringCase.childConcerns == 'Y' || tieringCase.riskToChildren == 'Y' || tieringCase.childProtection == 'Y'

    // Step 1 - ARP/CSRP
    const step1 = calculateStep1(arpRisk, tieringCase.ncRsrPercentageScore)

    // Step 2 - OSP. Higher of 2a and 2b overrules step 1 if either can be calculated
    const step2a = calculateStep2a(ospContactRisk, ospContactBand, tieringCase.dcSrpRiskReduction, tieringCase.ncOspDcPercentageScore == null)
    const step2b = calculateStep2b(ospImageBand)
    const step2Combined = getHigherTier(step2a, step2b)

    // Step 3 - ROSH and MAPPA.  Highest tier from steps one and two is for the decision between B+ and B-
    const step3 = calculateStep3(rosh, tieringCase.mappa, getHigherTier(step1, step2Combined))

    // Step 4 - ROSH
    const step4 = calculateStep4(rosh)

    // Step 5 - lifers
    const step5 = calculateStep5(tieringCase.lifer, tieringCase.custodyInd, tieringCase.communityDate, tieringCase.dateCompleted)

    // Step 6 - can raise the result for stalking, da, cp
    const step6 = calculateStep6(tieringCase.stalking == 'Y', tieringCase.da == 'Y', tieringCase.daHistory == 'Y', cp)

    // Combine all the results.  Step 2 can overrule step 1 (higher or lower), 3 to 6 can only raise the result
    let finalTier = step2Combined == null ? step1 : step2Combined
    finalTier = getHigherTier(finalTier, step3)
    finalTier = getHigherTier(finalTier, step4)
    finalTier = getHigherTier(finalTier, step5)
    finalTier = getHigherTier(finalTier, step6)

    logText.push(`        Step 1  - ${step1}`)
    logText.push(`        Step 2a - ${step2a}`)
    logText.push(`        Step 2b - ${step2b}`)
    logText.push(`        Step 3  - ${step3}`)
    logText.push(`        Step 4  - ${step4}`)
    logText.push(`        Step 5  - ${step5}`)
    logText.push(`        Step 6  - ${step6}`)

    // If failed on step 1, only take the final result if it's A
    if (step1 == null && finalTier != 'A') {
        finalTier = null
    } 

    return finalTier
}

function calculateStep1(arp: number, csrp: number): Tier {

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

function calculateStep2a(ospRisk: number, ospContactBand: string, riskReduced: string, oldPercentageBands: boolean): Tier {

    if (ospRisk == null || ospContactBand == null) {
        return null
    }

    // if (oldPercentageBands) {
    //     if (riskReduced == 'Y') {
    //         return ospRisk >= 2.90 ? 'B Upper' : ospRisk >= 2.00 ? 'B Lower' : ospRisk >= 1.37 ? 'C Upper' : ospRisk >= 0.03 ? 'C Lower' : null
    //     } else {
    //         return ospRisk >= 2.90 ? 'A' : ospRisk >= 1.37 ? 'B Upper' : ospRisk >= 0.82 ? 'B Lower' : ospRisk >= 0.50 ? 'C Upper' : ospRisk >= 0.03 ? 'C Lower' : null
    //     }
    // } else {
    //     if (riskReduced == 'Y') {
    //         return ospRisk >= 5.31 ? 'B Upper' : ospRisk >= 3.36 ? 'B Lower' : ospRisk >= 2.11 ? 'C Upper' : ospRisk >= 0.02 ? 'C Lower' : null
    //     } else {
    //         return ospRisk >= 5.31 ? 'A' : ospRisk >= 2.11 ? 'B Upper' : ospRisk >= 1.12 ? 'B Lower' : ospRisk >= 0.6 ? 'C Upper' : ospRisk >= 0.02 ? 'C Lower' : null
    //     }
    // }

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

function calculateStep2b(ospBand: string): Tier {

    if (ospBand == null) {
        return null
    }

    const band = ospBand.substring(0, 1)
    return band == 'H' ? 'B Lower' : band == 'M' ? 'C Upper' : null
}

function calculateStep3(rosh: string, mappa: string, step1: Tier): Tier {

    if (mappa == 'Y' && rosh != null) {
        switch (rosh) {
            case 'V':
                return 'A'
            case 'H':
                return tierNumbers[step1] >= tierNumbers['B Upper'] ? 'B Upper' : 'B Lower'
            case 'M':
                return 'C Upper'
            case 'L':
                return 'C Lower'
        }
    }
    return null
}

function calculateStep4(rosh: string): Tier {

    return rosh == 'V' ? 'B Lower' : rosh == 'H' ? 'C Lower' : null
}

function calculateStep5(lifer: string, custodyInd: string, communityDate: string, completionDate: string): Tier {

    if (lifer != 'Y' || custodyInd == 'Y' || communityDate == null || completionDate == null) {
        return null
    }

    const firstDate = dayjs(completionDate, dateFormat)
    const secondDate = dayjs(communityDate, dateFormat)
    const diffDays = firstDate.diff(secondDate, 'day')  // Assessment date minus community date

    if (diffDays < 0) { // Community date is in the future
        return null
    }

    const diffYears = firstDate.diff(secondDate, 'year')  // Assessment date minus community date
    return diffYears >= 1 ? 'D' : 'B Upper'
}

function calculateStep6(stalking: boolean, da: boolean, daHistory: boolean, cp: boolean): Tier {

    return stalking || da || daHistory || cp ? 'D' : null
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
