class SpreadSheetApp {
    constructor(readonly context: Excel.RequestContext) { }

    getActive(): Worksheet {
        return new Worksheet(this.context.workbook, this.context.workbook.worksheets.getActiveWorksheet())
    }
    getUi(): UI {
        return new UI()
    }
}

interface HtmlService {
    createHtmlOutput(): HtmlOutput
}

class UI {
    showSidebar(html: HtmlOutput): void {
        document.body.innerHTML = html.getContent()
    }
}

class HtmlOutput {
    contents: string[] = []

    append(content: string): this {
        this.contents.push(content)
        return this
    }

    getContent(): string {
        return this.contents.join('\n')
    }
}

class GRange {
    constructor(private range: Excel.Range) { }

    setValue(value: any): void {
        this.range.values = value
    }

    setBackground(bg: string): void {
        this.range.format.fill.color = bg
    }

    merge() {
        this.range.merge()
    }
}

class GSelection {
    constructor(private workbook: Excel.Workbook) { }

    getActiveRange(): GRange {
        return new GRange(this.workbook.getSelectedRange())
    }
}

class Worksheet {
    constructor(private workbook: Excel.Workbook, private worksheet: Excel.Worksheet) { }

    getRange(address: string): GRange {
        return new GRange(this.worksheet.getRange(address))
    }

    getSelection(): GSelection {
        return new GSelection(this.workbook)
    }
}


const HtmlService: HtmlService = {
    createHtmlOutput(): HtmlOutput {
        return new HtmlOutput()
    }
}


