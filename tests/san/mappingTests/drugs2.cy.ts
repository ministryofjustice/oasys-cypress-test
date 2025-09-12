import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Drugs part 2', () => {
        mappingTest(data.Drugs2.script)
    })
})