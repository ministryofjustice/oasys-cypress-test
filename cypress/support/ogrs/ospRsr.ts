import Decimal from 'decimal.js'

import { ospCoefficients } from './data/ospCoefficients'
import { OutputParameters, ScoreBand, TestCaseParameters } from './types'
import { calculateProbability, checkMissingQuestions, calculateBand, probabilityToPercentage, requiredParams, missingText } from './calculateScore'
import { reportScores, addOutputParameter } from './createOutput'

export function ospRsrCalc(params: TestCaseParameters, outputParams: OutputParameters) {

    // Calculate OSP-C, OSP-I and RSR

    let percentageOspC = new Decimal(0)
    let percentageOspI = new Decimal(0)

    // OSP-C
    if (params.female) {
        if (params.ONE_POINT_THIRTY == 'Y') {
            percentageOspC = probabilityToPercentage(ospCoefficients.osp_c.ospFemale)
        }
        reportScores(outputParams, 'osp_c', null, new Decimal(0), null, 'A', 0, `''`)
    } else if (!params.male) {
        reportScores(outputParams, 'osp_c', null, new Decimal(0), null, 'A', 0, `'OSP-DC can't be calculated on gender other than Male.'`)
    } else if (params.ONE_POINT_THIRTY == 'N') {
        reportScores(outputParams, 'osp_c', null, new Decimal(0), null, 'A', 0, `''`)
    } else if (params.ONE_POINT_THIRTY == null) {
        reportScores(outputParams, 'osp_c', null, null, null, 'E', 1, `'1.30 Have they ever committed a sexual or sexually motivated offence?\n'`)
    } else {
        const missing = checkMissingQuestions(params, requiredParams['osp_c'])
        if (params.CURR_SEX_OFF_MOTIVATION == 'Y' && params.STRANGER_VICTIM == null) {
            missing.result = `'${missing.result.replaceAll(`'`, '')}${missingText.STRANGER_VICTIM}\n'`
            missing.count++
        }
        if (missing.count > 0) {
            reportScores(outputParams, 'osp_c', null, null, null, 'E', missing.count, missing.result)
        } else {
            const contactAdultScore = params.CONTACT_ADULT_SANCTIONS == 0 ? 0 : params.CONTACT_ADULT_SANCTIONS == 1 ? 5 : params.CONTACT_ADULT_SANCTIONS == 2 ? 10 : 15
            const contactChildScore = params.CONTACT_CHILD_SANCTIONS == 0 ? 0 : params.CONTACT_CHILD_SANCTIONS == 1 ? 3 : params.CONTACT_CHILD_SANCTIONS == 2 ? 6 : 9
            const nonContactScore = params.PARAPHILIA_SANCTIONS == 0 ? 0 : params.PARAPHILIA_SANCTIONS == 1 ? 2 : params.PARAPHILIA_SANCTIONS == 2 ? 4 : 6
            const ageScore = (params.age < 18 || params.age > 59) ? 0 : Math.ceil((60 - params.age) / 3)
            const ageAtLastSanctionSexualScore = params.ageAtLastSanctionSexual > 17 ? 10 : params.ageAtLastSanctionSexual > 15 ? 5 : 0
            const previousHistoryScore = params.TOTAL_SANCTIONS_COUNT <= 1 ? 0 : 6
            const contactWithStrangerScore = params.STRANGER_VICTIM == 'Y' ? 4 : 0

            const totalScore = contactAdultScore + contactChildScore + nonContactScore + ageScore + ageAtLastSanctionSexualScore + previousHistoryScore + contactWithStrangerScore

            // TODO awaiting definitive spec from PH
            // const c = ospCoefficients.osp_c
            // const zScore = c.OSPCIntercept.add(c.OSPCFactor.times(0.5 + (0.5 * totalScore)))

            const c = ospCoefficients.osp_ddc
            const zScore = c.OSPCIntercept.add(c.OSPCFactor.times(totalScore))

            percentageOspC = probabilityToPercentage(calculateProbability(zScore))
            const band = ospBand(params, totalScore)

            addOutputParameter(outputParams, 'osp_c', 'riskReduction', band.reduced)
            reportScores(outputParams, 'osp_c', new Decimal(totalScore), percentageOspC, band.band, 'Y', 0, `''`)
        }
    }

    // OSP-I
    if (params.female) {
        reportScores(outputParams, 'osp_i', null, new Decimal(0), null, 'A', 0, `''`)
    } else if (!params.male) {
        reportScores(outputParams, 'osp_i', null, new Decimal(0), null, 'A', 0, `'OSP-IIC can't be calculated on gender other than Male.'`)
    } else if (params.ONE_POINT_THIRTY == 'N') {
        reportScores(outputParams, 'osp_i', null, new Decimal(0), null, 'A', 0, `''`)
    } else if (params.ONE_POINT_THIRTY == null) {
        reportScores(outputParams, 'osp_i', null, null, null, 'E', 1, `'1.30 Have they ever committed a sexual or sexually motivated offence?\n'`)
    } else {
        const missing = checkMissingQuestions(params, requiredParams['osp_i'])
        if (missing.count > 0) {
            reportScores(outputParams, 'osp_i', null, null, null, 'E', missing.count, missing.result)
        } else {
            // const c = ospCoefficients.osp_i
            const c = ospCoefficients.osp_iic  // TODO awaiting confirmation from PH that this is the correct algorithm
            const noSanctionsSexualOffences = params.CONTACT_ADULT_SANCTIONS + params.INDECENT_IMAGE_SANCTIONS +
                params.CONTACT_CHILD_SANCTIONS + params.PARAPHILIA_SANCTIONS == 0
            const twoPlusIIOC = params.INDECENT_IMAGE_SANCTIONS > 1
            const oneIIOC = params.INDECENT_IMAGE_SANCTIONS == 1
            const twoPlusChildContact = params.CONTACT_CHILD_SANCTIONS > 1
            const oneChildContact = params.CONTACT_CHILD_SANCTIONS == 1

            const probabilityOspI = (params.female ? c.OSPIFemale : noSanctionsSexualOffences ? c.OSPINoSanctions : twoPlusIIOC ? c.OSPITwoPlusIIOC :
                oneIIOC ? c.OSPIOneIIOC : twoPlusChildContact ? c.OSPITwoPlusChildContact : oneChildContact ? c.OSPIOneChildContact : c.OSPIOthers)

            const band: ScoreBand = params.female || noSanctionsSexualOffences ? 'N/A' : twoPlusIIOC ? 'High' : oneIIOC ? 'Medium' : 'Low'
            percentageOspI = probabilityToPercentage(probabilityOspI)

            reportScores(outputParams, 'osp_i', null, percentageOspI, band, 'Y', 0, `''`)
        }
    }

    // RSR
    const rsrMissing = checkRsrMissingQuestions(params, outputParams)
    if (!params.male && !params.female) {
        reportScores(outputParams, 'rsr', null, null, null, 'E', 0, `'RSR can't be calculated on gender other than Male and Female.'`)
        return null

    } else if (rsrMissing.failed) {
        reportScores(outputParams, 'rsr', null, null, null, 'E', rsrMissing.count, rsrMissing.result)
        addOutputParameter(outputParams, 'rsr', 'dynamic', outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'Y' : 'N')

    } else {
        let percentageRsr = outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? outputParams.SNSV_PERCENTAGE_DYNAMIC : outputParams.SNSV_PERCENTAGE_STATIC
        percentageRsr = percentageRsr?.add(percentageOspC).add(percentageOspI) ?? null

        const band = calculateBand('rsr', percentageRsr)
        reportScores(outputParams, 'rsr', null, percentageRsr, band, 'Y', rsrMissing.count, rsrMissing.result)
        addOutputParameter(outputParams, 'rsr', 'dynamic', outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'Y' : 'N')
    }

}

function ospBand(params: TestCaseParameters, totalScore: number): { band: ScoreBand, reduced: 'Y' | 'N' } {

    const band: ScoreBand = totalScore < 22 ? 'Low' : totalScore < 30 ? 'Medium' : totalScore < 36 ? 'High' : 'Very High'

    if (band == 'Low' || !params.male || params.CUSTODY_IND == 'Y' || !params.out5Years || params.offenceInLast5Years || params.sexualOffenceInLast5Years) {
        return { band: band, reduced: 'N' }
    }

    return { band: band == 'Very High' ? 'High' : band == 'High' ? 'Medium' : 'Low', reduced: 'Y' }
}


export function checkRsrMissingQuestions(params: TestCaseParameters, outputParams: OutputParameters): { count: number, result: string, failed: boolean } {

    const missing: string[] = []
    let failed = false

    if (params.ONE_POINT_THIRTY == null && (params.male || params.female)) {
        missing.push(missingText.ONE_POINT_THIRTY)
        failed = true
    }

    const snsvRequired = requiredParams[params.STATIC_CALC == 'Y' ? 'serious_violence_brief' : 'serious_violence_extended']
    snsvRequired.forEach((param) => {
        if (params[param] == null) {
            const text = missingText[param]
            missing.push(text == undefined ? param : text)
        }
    })
    if (missing.length > 0) {
        // Check for fallback to static - don't fail if there are no missing static questions
        if (params.STATIC_CALC == 'N') {
            const staticSnsvRequired = requiredParams['serious_violence_brief']
            staticSnsvRequired.forEach((param) => {
                if (params[param] == null) {
                    failed = true
                }
            })
        } else {
            failed = true
        }
    }

    if (params.ONE_POINT_THIRTY == null && (params.male || params.female)) {
        // missing.push(missingText.ONE_POINT_THIRTY)
    } else {
        if (outputParams.OSP_DC_CALCULATED == 'E') {
            requiredParams['osp_c'].forEach((param) => {
                if (params[param] == null) {
                    const text = missingText[param]
                    missing.push(text == undefined ? param : text)
                    failed = true
                }
            })
            if (params.CURR_SEX_OFF_MOTIVATION == 'Y' && params.STRANGER_VICTIM == null) {
                missing.push(missingText.STRANGER_VICTIM)
                failed = true
            }
        }

        if (outputParams.OSP_IIC_CALCULATED == 'E') {
            requiredParams['osp_i'].forEach((param) => {
                if (params[param] == null) {
                    const text = missingText[param]
                    missing.push(text == undefined ? param : text)
                }
                failed = true
            })
        }
    }
    const filteredMissing = uniq(missing)
    const result = filteredMissing.length == 0 ? `''` : `'${filteredMissing.join('\n')}\n'`
    return { count: filteredMissing.length, result: result, failed: failed }
}

function uniq(a: string[]): string[] {
    return Array.from(new Set(a))
}