import { mappingTest } from '../mappingTestDetails'
import * as data from '../data/mapping'


describe('SAN mapping tests', () => {

    it('Control characters', () => {
        mappingTest(data.ControlCharacters.script)
    })
})
