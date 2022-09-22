export async function ensureWorksheet(context: Excel.RequestContext, name: string) {
    let ws = context.workbook.worksheets.getItemOrNullObject(name)
    ws.load()
    await context.sync()
    if (ws.isNullObject) {
        ws = context.workbook.worksheets.add(name)
        ws.position = 0
        await context.sync()
    }
    return ws
}

export async function ensureTable(tables: Excel.TableCollection, startingCell: Excel.Range, values: any[][], name: string) {
    let table = tables.getItemOrNullObject(name)
    table.load()
    await table.context.sync()
    const range = startingCell.getAbsoluteResizedRange(values.length, values[0].length)

    range.load('rowCount,columnCount')
    await range.context.sync()
    console.log(`${values.length}x${values[0].length} vs ${range.rowCount}x${range.columnCount}`)

    if (table.isNullObject) {
        range.values = values
        table = tables.add(range, true)
    } else {
        table.columns.load('items/length')
        table.rows.load('items/length')
        await tables.context.sync()
        if ((table.rows.items.length + 1) < values.length) {
            // need to expand
            const rows = values.slice(1, values.length + 1 - table.rows.items.length).map(v => new Array(table.columns.items.length))
            console.log(rows)
            table.rows.add(0, rows, true)
            await table.context.sync()
        } else if ((table.rows.items.length + 1) > values.length) {
            // need to shrink
            table.resize(range)
        }

        if (table.columns.items.length < values[0].length) {
            // expand col
            table.columns.add(-1, values[0].slice(0, values[0].length - table.columns.items.length))
        } else if (table.columns.items.length > values[0].length) {
            for (let i = 0; i < table.columns.items.length - values[0].length; ++i) {
                table.columns.getItemAt(0).delete()
            }
        }
        range.values = values
    }
    table.name = name
    return table
}

export function normalizeWorksheetName(name: string) {
    return name.substring(0, 31).replace(/[:]/g, ' ')
}