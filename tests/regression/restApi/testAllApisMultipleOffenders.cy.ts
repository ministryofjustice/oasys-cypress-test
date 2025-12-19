import * as oasys from 'oasys'
import { testEnvironment } from '../../../localSettings'

/**
 * Tests all endpoints against a randomish set of 360 offenders based on specified date conditions covering 2015 to yesterday.
 * Also uses a number of specific offender test cases to improve coverage of properties in the endpoints.
 */
describe('RestAPI regression tests', () => {

    const startTime = Cypress.dayjs().format('YYYY-MM-DD HH:mm:ss')

    let stats: EndpointStat[] = []
    let offendersTested = 0

    // Number of offenders for each date range
    const offenderCountEarly = 20  // Used for pre-2023, not many offenders available
    const offenderCount = 60  // 2023 and later

    // Define date parameters for sets of offender data
    const dateConditions = [
        { date: `2015-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
        { date: `2016-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
        { date: `2017-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
        { date: `2018-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
        { date: `2019-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
        { date: `2020-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
        { date: `2021-${randomMonth()}-${randomDay()}`, count: offenderCount },
        { date: `2022-${randomMonth()}-${randomDay()}`, count: offenderCount },
        { date: `2023-${randomMonth()}-${randomDay()}`, count: offenderCount },
        { date: `2024-${randomMonth()}-${randomDay()}`, count: offenderCount },
        { date: 'today', count: offenderCount },
    ]

    const offendersToSkip = `('D011517', 'X083869', 'X334486')` // Duff test data in T2.  ; 2: , 3: 
    const testDataIssues = [
        `'D011517'`,  // duplicate oasys_set created in 2012
        `'X083869'`,  // return/linefeed mismatching
        `'X334486'`,  // 888 offence code issue
        `'X552026'`,  // no assessments / no matching assessments confusion
    ]

    for (let i = 0; i < dateConditions.length; i++) {
        it(`All endpoint regression tests - part ${i + 1}: ${dateConditions[i].count} offenders created before ${dateConditions[i].date}`, () => {
            testOffenderSet(dateConditions[i])
        })
    }

    // Get a list of offenders based on the date specified, then call the API test for each in turn.
    function testOffenderSet(dateCondition: { date: string, count: number }) {

        const dateFilter = dateCondition.date == 'today' ? 'sysdate' : `to_date('${dateCondition.date}','YYYY-MM-DD')`
        const offendersToSkip = `(${testDataIssues.join()})`

        const offenderQuery = `select * from 
                                    (select cms_prob_number, cms_pris_number from eor.offender 
                                        where cms_prob_number is not null
                                        and deleted_date is null
                                        and create_date <= ${dateFilter} 
                                        and cms_prob_number not in ${offendersToSkip}
                                        order by create_date desc)
                                        where rownum <= ${dateCondition.count}`

        oasys.Db.getData(offenderQuery, 'offenderResult')

        cy.get<string[][]>('@offenderResult').then((offenders) => {
            runTest(offenders)
        })
    }

    // Extra cases specific to Capita environments
    const extraTestCases = [
        ['AZ97320', null],
        ['A1111QC', null],
        ['DS12345', null],       // Assessment selection criteria
        ['a454545', null],       // Assessment selection criteria       
        ['ZYTGLMN', null],       // RMP timeline issue
        ['WS54109', null],      // Empty offence block
        ['290508', null],        // Number with leading zero
        ['D13079A', 'A2222BW'],
        ['CRN11AG', 'A1111AG'],
        ['CRN4094', 'C4094RN'],
        ['UGVAAAA', null],
        ['TRA001', null],
        ['ZFJWVOH', null],
        ['ZAAEUDK', null],
        ['ZPDMMDO', null],
        ['ZWXZHPN', null],
        ['ZYVSDTV', null],  // fullyPopulatedLayer1 (in system test on 29/11)
        ['ZFCJDLP', null],  // fullyPopulatedLayer3 (in system test on 29/11)
        ['ZCLUWYS', null],  // fullyPopulatedLayer3MaxStrings (in system test on 29/11)
        ['ZXRWTTK', 'Z6331QT'],  // fullyPopulatedLayer3MaxStringsPrison (in system test on 29/11)
        ['ZENIEZF', 'Z7251BN'],  // fullyPopulatedLayer3Prison (in system test on 29/11)
        ['ZJVGRBQ', null],  // fullyPopulatedLayer1v2 (in system test on 1/12)
        ['A1111QE', null],     // lots of assessments with lots of data
        ['CRN8826', null],      // offender has a LAYER2 assessment
        ['PS501143', null],     // objectiveDesc example
    ]

    /* Lowercase examples - need fix for NOD-872 before adding these
        ['prob3939'], ['prob7373'], ['prob9987'], ['xxxxxxxxxxxxxxxxxxxx'], ['lkjlkj'], ['abcdefgh'], ['tmw4605'],
        ['a454545'], ['crn8859'], ['Cr12345'], ['x901187'], ['x901111']
    */

    // 
    if (testEnvironment.name.includes('system') || testEnvironment.name.includes('informal')) {
        it(`All endpoint regression tests - extra test for specific cases`, () => {
            runTest(extraTestCases)
        })
    }

    function runTest(offenders: string[][]) {

        let failed = false
        let count = 1

        offenders.forEach((offender) => {
            cy.task('consoleLog', `Offender ${count++}: ${offender[0]} / ${offender[1]}`)
            offendersTested++

            if (offender[0] != null) {  // call with probation CRN
                oasys.Api.testOneOffender(offender[0], 'prob', 'probationFailedAlias', false, stats)
                cy.get<boolean>('@probationFailedAlias').then((offenderFailed) => {
                    if (offenderFailed) {
                        cy.task('consoleLog', 'Failed')
                        failed = true
                    }
                })
            }
            if (offender[1] != null) {  // call with NomisId
                oasys.Api.testOneOffender(offender[1], 'pris', 'prisonFailedAlias', offender[0] != null, stats)  // skipPrisSubsequents if already done for prob crn
                cy.get<boolean>('@prisonFailedAlias').then((offenderFailed) => {
                    if (offenderFailed) {
                        cy.task('consoleLog', 'Failed')
                        failed = true
                    }
                })
            }
        })
        cy.then(() => { if (failed) throw new Error('Error running RestAPI tests.') })
    }

    function randomMonth(): string {
        return Math.ceil(Math.random() * (12)).toString().padStart(2, '0')
    }

    function randomDay(): string {
        return Math.ceil(Math.random() * (28)).toString().padStart(2, '0')
    }

    // Report the total number of API calls from the log from this IP address since the test started

    let totalApiCount = 0
    let totalApiTimeMs = 0
    let totalDbTimeMs = 0

    it('Summary info', () => {

        cy.groupedLogStart('Timing stats')

        reportStats()
        cy.groupedLogEnd()

        let elapsedTimeS = Math.round(Cypress.dayjs().diff(startTime) / 1000)
        cy.groupedLogStart('Totals')
        cy.groupedLog(`Offenders: ${offendersTested}`)
        cy.groupedLog(`API calls: ${totalApiCount}`)
        cy.groupedLog(`Database query time: ${Math.round(totalDbTimeMs / 1000)}s`)
        cy.groupedLog(`API response time: ${Math.round(totalApiTimeMs / 1000)}s`)
        cy.groupedLog(`Total elapsed time: ${elapsedTimeS}s`)
        cy.groupedLog(`Average call rate: ${Math.round(totalApiCount / elapsedTimeS)} calls per second`)
        cy.groupedLog(`Average response time: ${Math.round(totalApiTimeMs / totalApiCount)}ms`)

        cy.groupedLogEnd()
    })

    function reportStats() {

        const endpoints = stats.map((stat) => stat.endpoint).filter(onlyUnique)
        endpoints.forEach((endpoint) => {
            const responseTimes = stats.filter((stat) => stat.endpoint == endpoint).map((stat) => stat.responseTime)
            const result = reportStat(endpoint, responseTimes)

            if (endpoint == 'database') {
                totalDbTimeMs += result.totalTime
            } else {
                totalApiCount += result.count
                totalApiTimeMs += result.totalTime
            }
        })
    }

    function reportStat(endpoint: string, responseTimes: number[]): { count: number, totalTime: number } {

        let count = responseTimes.length
        let total = 0

        let reportString = `${endpoint}: count ${count}`
        if (count > 0) {
            total = responseTimes.reduce((a, b) => a + b, 0)
            let max = Math.max(...responseTimes)
            let maxHighlight = max > 99 && endpoint != 'database' ? ' **** ' : ''
            let average = Math.round(total / count)
            let averageHighlight = average > 99 && endpoint != 'database' ? ' **** ' : ''
            reportString = `${reportString}, min ${Math.min(...responseTimes)}ms, ${maxHighlight}max ${max}ms${maxHighlight}, ${averageHighlight}average ${average}ms${averageHighlight}`
            cy.groupedLog(reportString)
        }

        return { count: count, totalTime: total }
    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

})
