import { OgrsTestParameters } from '../../cypress/support/ogrs/types'
import { runTest } from './testLib'

describe('OGRS calculator test', () => {

    const staticFlag = 'Y'

    const dbTestParams: OgrsTestParameters = {
        testType: 'db',
        dbDetails: {
            type: 'assessment',
            whereClause: `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`,
            count: 10000,
        },
        staticFlag: staticFlag,
        reportMode: 'minimal',
    }

    const csvTestParams: OgrsTestParameters = {
        testType: 'csv',
        csvDetails: {
            dataFile: '',
        },
        staticFlag: staticFlag,
        reportMode: 'minimal',
    }

    it(`Layer 3 v1 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    it(`Layer 3 v1 not complete (any other status)`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    it(`Layer 3 v2 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 2 and assessment_status_elm = 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    it(`Layer 1 v2 complete`, () => {

        dbTestParams.dbDetails.type = 'assessment'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm = 'COMPLETE'`,
            runTest(dbTestParams, '', false, false)
    })

    it(`Standalone RSR complete`, () => {

        dbTestParams.dbDetails.type = 'rsr'
        dbTestParams.dbDetails.whereClause = `deleted_date is null and rsr_status = 'COMPLETE'`
        runTest(dbTestParams, '', false, false)
    })

    it('Example set of 20', () => {

        csvTestParams.csvDetails.dataFile = 'test1Input'
        csvTestParams.staticFlag = null
        runTest(csvTestParams, '', false, false)
    })

    it('Example set of 20 (with some missing questions)', () => {

        csvTestParams.csvDetails.dataFile = 'test1inputWithMissingFields'
        csvTestParams.staticFlag = null
        runTest(csvTestParams, '', false, false)
    })

})