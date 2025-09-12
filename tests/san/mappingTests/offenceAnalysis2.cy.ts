import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Offence analysis part 2', () => {
        mappingTest(data.OffenceAnalysis2.script, true)
    })
})
