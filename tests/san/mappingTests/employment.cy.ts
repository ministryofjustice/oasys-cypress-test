import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Employment', () => {
        mappingTest(data.Employment.script)
    })
})
