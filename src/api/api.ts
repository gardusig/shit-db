function createSheet(sheetName, header) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (transactionSheet) {
    sheet.clear();
  }
  sheet = spreadsheet.insertSheet(sheetName);
  sheet.appendRow(header);
}
