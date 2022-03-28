declare class SpreadSheetApp {
    readonly context: Excel.RequestContext;
    constructor(context: Excel.RequestContext);
    getActive(): Worksheet;
    getUi(): UI;
}
interface HtmlService {
    createHtmlOutput(): HtmlOutput;
}
declare class UI {
    showSidebar(html: HtmlOutput): void;
}
declare class HtmlOutput {
    contents: string[];
    append(content: string): this;
    getContent(): string;
}
declare class GRange {
    private range;
    constructor(range: Excel.Range);
    setValue(value: any): void;
    setBackground(bg: string): void;
    merge(): void;
}
declare class GSelection {
    private workbook;
    constructor(workbook: Excel.Workbook);
    getActiveRange(): GRange;
}
declare class Worksheet {
    private workbook;
    private worksheet;
    constructor(workbook: Excel.Workbook, worksheet: Excel.Worksheet);
    getRange(address: string): GRange;
    getSelection(): GSelection;
}
declare const HtmlService: HtmlService;
interface GoogleContext {
    SpreadsheetApp: SpreadSheetApp;
}
declare const GoogleSheet: {
    run(code: (context: GoogleContext) => void): void;
};
