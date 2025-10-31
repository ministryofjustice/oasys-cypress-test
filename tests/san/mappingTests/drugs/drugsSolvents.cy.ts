import { mappingTest } from '../xMappingTest'
import * as data from '../../data/mapping'

// Ensure tests/data/local/mappingTestsOffender.txt has been updated by running aaSanMappingTestOffender first.

describe('SAN mapping tests', () => {

    it('Solvents', () => {
        mappingTest(data.Solvents.script)
    })
})
