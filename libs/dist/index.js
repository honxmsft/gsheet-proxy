"use strict";
class SpreadSheetApp {
    constructor(workbook) {
        this.workbook = workbook;
    }
    getActive() {
        return new Worksheet(this.workbook, this.workbook.getActiveWorksheet());
    }
    getUi() {
        return new UI();
    }
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
const SpreadsheetApp = new SpreadSheetApp(workbook || window.workbook);
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