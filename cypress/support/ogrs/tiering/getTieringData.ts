import * as db from '../../oasysDb'
import { TieringCase } from './dbClasses'

export async function getTieringTestData(rows: number, whereClause: string): Promise<TieringCase[]> {

    const tieringData = await db.selectData(TieringCase.query(rows, whereClause))
    if (tieringData.error != null) throw new Error(tieringData.error)
    const cases = tieringData.data as string[][]

    const result: TieringCase[] = []
    for (let a = 0; a < cases.length; a++) {
        result.push(new TieringCase(cases[a]))
    }

    return result
}
