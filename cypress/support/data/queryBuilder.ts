import { stringToFloat, stringToInt } from 'lib/utils';
import { OasysDateTime } from 'oasys';


export function buildQuery(columns: Columns | Columns[], tables: Table[], whereCondition: string, orderBy: string): string {

    let query = 'select '

    if (columns.constructor.name == 'Array') {
        for (let columnSet of (columns as Columns[])) {
            query = query.concat(getColumns(columnSet, tables[0]))
        }
    } else {
        query = query.concat(getColumns(columns as Columns, tables[0]))
    }
    query = query.slice(0, -1).concat(' \n') // remove last comma, add newline for readability when debugging

    const where = whereCondition == null ? '' : `where ${whereCondition}`
    const order = orderBy == null ? '' : `order by ${orderBy}`

    let tableList = ''
    tables.forEach((table) => {
        tableList = tableList.concat(`eor.${table}, `)
    })
    tableList = tableList.slice(0, -2)

    return query.concat(`from ${tableList}
                            ${where}
                            ${order}
                        `)
}



export function getColumns(columns: Columns, defaultTable: string): string {

    let result = ''
    Object.keys(columns).forEach((key) => {
        result = result.concat(column(columns[key], defaultTable))
    })
    return result
}

function column(column: ColumnDef, defaultTable: string): string {

    let table = column.table == '' ? defaultTable : column.table

    return column.type == 'date'
        ? `to_char(${table}.${column.name}, '${OasysDateTime.oracleTimestampFormat}'),`
        : `${table}.${column.name},`
}

export function assignValues(obj: {}, columns: Columns, data: string[], startIndex: number) {

    let i = startIndex
    Object.keys(columns).forEach((key) => {
        const column = columns[key]
        switch (column.type) {
            case 'date':
                obj[key] = data[i++]
                break
            case 'float':
                obj[key] = stringToFloat(data[i++])
                break
            case 'integer':
                obj[key] = stringToInt(data[i++])
                break
            case 'string':
                obj[key] = data[i++]
        }
    })
}
