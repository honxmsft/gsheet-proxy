"use strict";
class SpreadSheetAppImpl {
    constructor(workbook) {
        this.workbook = workbook;
    }
    getActiveSpreadsheet() {
        return new Worksheet(this.workbook, this.workbook.getActiveWorksheet());
    }
    getActive() {
        return new Worksheet(this.workbook, this.workbook.getActiveWorksheet());
    }
    getUi() {
        return new UI();
    }
}
class UiAppImpl {
}
class UI {
    showSidebar(html) {
        document.getElementById('app').innerHTML = html.getContent();
    }
}
class HtmlOutput {
    constructor() {
        this.contents = [];
    }
    append(content) {
        this.contents.push(content);
        return this;
    }
    getContent() {
        return this.contents.join("\n");
    }
}
class GRange {
    constructor(range) {
        this.range = range;
    }
    setValue(value) {
        this.range.setValue(value);
    }
    getValue() {
        return this.range.getValue();
    }
    setBackground(bg) {
        this.range.getFormat().getFill().setColor(bg);
    }
    merge() {
        this.range.merge();
    }
}
class GSelection {
    constructor(workbook) {
        this.workbook = workbook;
    }
    getActiveRange() {
        return new GRange(this.workbook.getSelectedRange());
    }
}
class Worksheet {
    constructor(workbook, worksheet) {
        this.workbook = workbook;
        this.worksheet = worksheet;
    }
    getRange(address) {
        return new GRange(this.worksheet.getRange(address));
    }
    getSelection() {
        return new GSelection(this.workbook);
    }
}
var HtmlService = {
    createHtmlOutput() {
        return new HtmlOutput();
    }
};
// @ts-ignore
const SpreadsheetApp = new SpreadSheetAppImpl(workbook || window.workbook);
class UiApp {
    static createApplication() {
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
});
//# sourceMappingURL=index.js.map