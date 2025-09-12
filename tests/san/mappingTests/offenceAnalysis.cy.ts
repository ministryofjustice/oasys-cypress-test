import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Offence analysis part 1', () => {
        mappingTest(data.OffenceAnalysis.script, true)
    })
})
