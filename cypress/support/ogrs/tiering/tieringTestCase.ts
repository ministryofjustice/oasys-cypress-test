import dayjs from 'dayjs'

import { Tier } from '../types'
import { TieringCase } from './dbClasses'
import { dateFormat } from './tieringTest'


export function testTieringCase(tieringCase: TieringCase, logText: string[]): Tier {

    let finalTier: Tier
    const rosh = (tieringCase.rosh == null || tieringCase.rosh == 'Y') ? tieringCase.roshLevelElm : tieringCase.rosh  // TODO remove workaround
    const arpRisk = tieringCase.ogp2Percentage2yr == null ? tieringCase.ogrs4gPercentage2yr : tieringCase.ogp2Percentage2yr

    // Step 1
    const step1 = calculateStep1(arpRisk, tieringCase.ncRsrPercentageScore)
    logText.push(`        Step 1  - ${step1}`)
    finalTier = step1
    
    // Step 2 - higher of 2a and 2b replace step 1 if they can be calculated
    const step2a = calculateStep2a(tieringCase.ncOspDcPercentageScore, tieringCase.dcSrpRiskReduction)
    logText.push(`        Step 2a - ${step2a}`)
    
    const step2b = calculateStep2b(tieringCase.ncOspIicRiskReconElm)
    logText.push(`        Step 2b - ${step2b}`)
    
    const step2Combined = getHigherTier(step2a, step2b)
    if (step2Combined != null) {
        finalTier = step2Combined
    }
    
    // Step 3 - can raise the result depending on ROSH and MAPPA
    const step3 = calculateStep3(rosh, tieringCase.mappa, step1)
    logText.push(`        Step 3  - ${step3}`)
    finalTier = getHigherTier(finalTier, step3)
    
    // Step 4 - can raise the result depending on ROSH
    const step4 = calculateStep4(rosh)
    logText.push(`        Step 4  - ${step4}`)
    finalTier = getHigherTier(finalTier, step4)
    
    // Step 5 - can raise the result for lifers
    const step5 = calculateStep5(tieringCase.lifer, tieringCase.custodyInd, tieringCase.communityDate, tieringCase.dateCompleted)
    logText.push(`        Step 5  - ${step5}`)
    finalTier = getHigherTier(finalTier, step5)
    
    // Step 6 - can raise the result for stalking, da, cp
    const step6 = calculateStep6(tieringCase)  // TODO check these flags
    logText.push(`        Step 6  - ${step6}`)
    finalTier = getHigherTier(finalTier, step6)

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

function calculateStep2a(ospRisk: number, riskReduced: string): Tier {

    if (ospRisk == null || riskReduced == null) {
        return null
    }

    if (riskReduced == 'Y') {
        return ospRisk >= 5.31 ? 'B Upper' : ospRisk >= 3.36 ? 'B Lower' : ospRisk >= 2.11 ? 'C Upper' : ospRisk >= 0.02 ? 'C Lower' : null
    } else {
        return ospRisk >= 5.31 ? 'A' : ospRisk >= 2.11 ? 'B Upper' : ospRisk >= 1.12 ? 'B Lower' : ospRisk >= 0.6 ? 'C Upper' : ospRisk >= 0.02 ? 'C Lower' : null
    }
}

function calculateStep2b(ospBand: string): Tier {

    return ospBand == 'High' ? 'B Lower' : ospBand == 'Medium' ? 'C Upper' : null
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

    return lifer == 'Y' ? 'B Upper' : null        
    
    // TODO replace this when HS is ready
    // Probably need to allow for case where Lifer flag is set but communityDate is null

    // if (lifer != 'Y' || custodyInd == 'Y' || communityDate == null || completionDate == null) {
    //     return null
    // }

    // const firstDate = dayjs(completionDate, dateFormat)
    // const secondDate = dayjs(communityDate, dateFormat)
    // return secondDate.diff(firstDate, 'year') >= 1 ? 'D' : 'B Upper'
}

function calculateStep6(tieringCase: TieringCase): Tier {

    // Stalking
    if (tieringCase.stalking) {
        return 'D'
    }
    // DA
    if (tieringCase.da || tieringCase.daHistory) {
        return 'D'
    }
    // CP
    if (tieringCase.childProtection) { // More flags
        return 'D'
    }
    return null
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
