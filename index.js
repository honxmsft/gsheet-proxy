"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const GoogleSheet = {
    run(code) {
        Excel.run((c) => __awaiter(this, void 0, void 0, function* () {
            code({ SpreadsheetApp: new SpreadSheetApp(c) });
        }));
    }
};
