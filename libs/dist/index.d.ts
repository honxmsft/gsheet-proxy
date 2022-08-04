declare class SpreadSheetAppImpl {
    readonly workbook: ExcelScript.Workbook;
    constructor(workbook: ExcelScript.Workbook);
    getActiveSpreadsheet(): Worksheet;
    getActive(): Worksheet;
    getUi(): UI;
}
declare class UiAppImpl {
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
    constructor(range: ExcelScript.Range);
    setValue(value: unknown): void;
    getValue(): string | number | boolean;
    setBackground(bg: string): void;
    merge(): void;
}
declare class GSelection {
    private workbook;
    constructor(workbook: ExcelScript.Workbook);
    getActiveRange(): GRange;
}
declare class Worksheet {
    private workbook;
    private worksheet;
    constructor(workbook: ExcelScript.Workbook, worksheet: ExcelScript.Worksheet);
    getRange(address: string): GRange;
    getSelection(): GSelection;
}
declare var HtmlService: HtmlService;
declare const SpreadsheetApp: SpreadSheetAppImpl;
interface UiLabel {
}
interface UiTextArea {
}
interface UiApp {
    setHeight(x: string | number): this;
    setWidth(x: string | number): this;
    setTitle(s: string): this;
    createLabel(label: string): UiLabel;
    createTextArea(): UiTextArea;
    createVerticalPanel(): UiVerticalPanel;
}
interface UiVerticalPanel {
    setWidth(v: string | number): this;
    setHeight(v: string | number): this;
}
declare class UiApp {
    static createApplication(): UiApp;
}
