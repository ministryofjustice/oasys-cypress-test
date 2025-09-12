import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Drugs part 1', () => {
        mappingTest(data.Drugs.script)
    })
})
