function autoCrat_whatIs() {
  var app = UiApp.createApplication().setHeight(550);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var panel = app.createVerticalPanel();
  var autoGrid = app.createGrid(1, 2);
  var image = app.createImage(this.AUTOCRATIMAGEURL);
  image.setHeight("100px");
  var label = app.createLabel(
    "autoCrat: Robust Google Docs merge, share, and email attachment utility: So you don't have to be the bureaucrat!"
  );
  label.setStyleAttribute("fontSize", "1.5em").setStyleAttribute("fontWeight", "bold");
  autoGrid.setWidget(0, 0, image);
  autoGrid.setWidget(0, 1, label);
  var mainGrid = app.createGrid(4, 1);
  var html = "<h3>Features</h3>";
  html += "<ul><li>Merge any spreadsheet or Google Form data into personalized, templated Google Docs or PDFs.</li>";
  html += "<li>Create your template file as a Google Document or Spreadsheet using &lt;&lt;merge tags&gt;&gt;.</li>";
  html += "<li>Easy-to-use field-mapper takes the hassle out of setting up merges.</li>";
  html += "<li>Organizes merged files into a collection of your choosing.</li>";
  html +=
    "<li>Dynamically names Docs, organizes links in your spreadsheet to improve your workflow when accessing Docs later.</li>";
  html += "<li>Enables sending of PDFs as email attachments.</li>";
  html += "<li>Allows for setting of conditions to only merge Doc if a value matches a criteria.</li>";
  html += "<li>Share merged Docs with recipient(s) as view-only or as editor.</li>";
  html += "<li>Include merge data in document header and footer.</li>";
  html +=
    "<li>Great for form letters, progress reports, personalized student assignments, equipment invoices, transcripts, etc.</li></ul>";
  mainGrid.setWidget(0, 0, app.createHTML(html));
  var sponsorLabel = app.createLabel("Brought to you by");
  var sponsorImage = app.createImage("http://www.youpd.org/sites/default/files/acquia_commons_logo36.png");
  var supportLink = app.createAnchor("Watch the tutorial!", "http://www.youpd.org/autocrat");
  mainGrid.setWidget(1, 0, sponsorLabel);
  mainGrid.setWidget(2, 0, sponsorImage);
  mainGrid.setWidget(3, 0, supportLink);
  app.add(autoGrid);
  panel.add(mainGrid);
  app.add(panel);
  ss.show(app);
  return app;
}
