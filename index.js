"use strict";
class SpreadSheetApp {
    constructor(context) {
        this.context = context;
    }
    getActive() {
        return new Worksheet(this.context.workbook, this.context.workbook.worksheets.getActiveWorksheet());
    }
    getUi() {
        return new UI();
    }
}
class UI {
    showSidebar(html) {
        document.body.innerHTML = html.getContent();
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
        return this.contents.join('\n');
    }
}
class GRange {
    constructor(range) {
        this.range = range;
    }
    setValue(value) {
        this.range.values = value;
    }
    setBackground(bg) {
        this.range.format.fill.color = bg;
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
const HtmlService = {
    createHtmlOutput() {
        return new HtmlOutput();
    }
};
