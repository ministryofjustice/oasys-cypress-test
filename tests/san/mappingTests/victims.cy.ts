import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Victims', () => {
        mappingTest(data.Victims.script)
    })
})
