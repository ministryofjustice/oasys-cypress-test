import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Alcohol part 2', () => {
        mappingTest(data.Alcohol2.script)
    })
})
