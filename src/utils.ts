export async function ensureWorksheet(context: Excel.RequestContext, name: string) {
    let ws = context.workbook.worksheets.getItemOrNullObject(name)
    ws.load()
    await context.sync()
    if (ws.isNullObject) {
        ws = context.workbook.worksheets.add(name)
        await context.sync()
    }
    return ws
}

export async function ensureTable(context: Excel.RequestContext, tables: Excel.TableCollection, range: Excel.Range, name: string) {
    let table = tables.getItemOrNullObject(name)
    table.load()
    await context.sync()
    if (table.isNullObject) { table = tables.add(range, true) }
    table.name = name
    return table
}

export function normalizeWorksheetName(name: string) {
    return name.substring(0, 31).replace(/[:]/g, ' ')
}