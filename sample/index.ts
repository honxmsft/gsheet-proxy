const html = HtmlService.createHtmlOutput();
html.append("<div>hello from addon</div>");
html.append(`<button onclick="google.script.run.handleClick()">Click</button>`);
SpreadsheetApp.getUi().showSidebar(html);

function handleClick() {
  const sheet = SpreadsheetApp.getActive();
  const range = sheet.getSelection().getActiveRange();
  range.setValue("click!!!");
  sheet.getRange("A1").setValue(`set fron addon`);
  sheet.getRange("B1").setBackground("red");
}

const sheet = SpreadsheetApp.getActive();
console.log(sheet)
const range = sheet.getSelection().getActiveRange();
console.log(range)
range.setValue("click!!!");
console.log(range.getValue())
