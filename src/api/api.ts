export function createSheet(sheetName: string, header: any[]) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(sheetName)
  if (sheet) {
    sheet.clear()
  }
  sheet = spreadsheet.insertSheet(sheetName)
  sheet.appendRow(header)
}
