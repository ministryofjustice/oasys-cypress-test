import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Alcohol part 1', () => {
        mappingTest(data.Alcohol.script)
    })
})
