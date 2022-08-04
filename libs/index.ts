
class SpreadSheetAppImpl {
    constructor(readonly workbook: ExcelScript.Workbook) {
    }

    getActiveSpreadsheet(): Worksheet {
        return new Worksheet(
            this.workbook,
            this.workbook.getActiveWorksheet()
        );
    }

    getActive(): Worksheet {
        return new Worksheet(
            this.workbook,
            this.workbook.getActiveWorksheet()
        );
    }
    getUi(): UI {
        return new UI();
    }

}

class UiAppImpl {

}

interface HtmlService {
    createHtmlOutput(): HtmlOutput;
}

class UI {
    showSidebar(html: HtmlOutput): void {
        document.getElementById('app')!.innerHTML = html.getContent()
    }
}

class HtmlOutput {
    contents: string[] = [];

    append(content: string): this {
        this.contents.push(content);
        return this;
    }

    getContent(): string {
        return this.contents.join("\n");
    }
}

class GRange {
    constructor(private range: ExcelScript.Range) { }

    setValue(value: unknown): void {
        this.range.setValue(value);
    }

    getValue() {
        return this.range.getValue()
    }

    setBackground(bg: string): void {
        this.range.getFormat().getFill().setColor(bg)
    }

    merge() {
        this.range.merge()
    }
}

class GSelection {
    constructor(private workbook: ExcelScript.Workbook) { }

    getActiveRange(): GRange {
        return new GRange(this.workbook.getSelectedRange());
    }
}

class Worksheet {
    constructor(private workbook: ExcelScript.Workbook, private worksheet: ExcelScript.Worksheet) { }

    getRange(address: string): GRange {
        return new GRange(this.worksheet.getRange(address));
    }

    getSelection(): GSelection {
        return new GSelection(this.workbook);
    }
}

var HtmlService: HtmlService = {
    createHtmlOutput(): HtmlOutput {
        return new HtmlOutput();
    }
};

// @ts-ignore
const SpreadsheetApp = new SpreadSheetAppImpl(workbook || window.workbook);


interface UiLabel {

}

interface UiTextArea {

}
interface UiApp {
    setHeight(x: string | number): this
    setWidth(x: string | number): this
    setTitle(s: string): this

    createLabel(label: string): UiLabel
    createTextArea(): UiTextArea

    createVerticalPanel(): UiVerticalPanel
}

interface UiVerticalPanel {
    setWidth(v: string | number): this
    setHeight(v: string | number): this
}

class UiApp {
    static createApplication(): UiApp {

    }
}

Object.assign(window, {
    HtmlService,
    google: {
        script: {
            run: window
        }
    },
    SpreadsheetApp,
})



