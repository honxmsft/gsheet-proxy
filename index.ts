class SpreadSheetApp {
    constructor(readonly context: () => Excel.RequestContext) {
        console.log("context");
        console.log(context);
    }

    getActive(): Worksheet {
        console.log("get active");
        console.log(this.context);
        return new Worksheet(
            () => this.context().workbook,
            () => this.context().workbook.worksheets.getActiveWorksheet()
        );
    }
    getUi(): UI {
        return new UI();
    }
}

interface HtmlService {
    createHtmlOutput(): HtmlOutput;
}

class UI {
    showSidebar(html: HtmlOutput): void {
        document.body.innerHTML = html.getContent();
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
    constructor(private range: () => Excel.Range) { }

    setValue(value: any): void {
        this.range().values = value;
        this.range().context.sync();
    }

    setBackground(bg: string): void {
        this.range().format.fill.color = bg;
        this.range().context.sync();
    }

    merge() {
        this.range().merge();
        this.range().context.sync();
    }
}

class GSelection {
    constructor(private workbook: () => Excel.Workbook) { }

    getActiveRange(): GRange {
        return new GRange(() => this.workbook().getSelectedRange());
    }
}

class Worksheet {
    constructor(private workbook: () => Excel.Workbook, private worksheet: () => Excel.Worksheet) { }

    getRange(address: string): GRange {
        return new GRange(() => this.worksheet().getRange(address));
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

window.HtmlService = HtmlService;

var context: Excel.RequestContext;
let _resolve: any;
var promise = new Promise((resolve) => {
    _resolve = resolve;
});
Excel.run(async (c) => {
    context = c;
    console.log("start");
    await promise;
    console.log("end");
});
var SpreadsheetApp = new SpreadSheetApp(() => context);
Object.assign(window, {
    google: {
        script: {
            run: window
        }
    }
})



