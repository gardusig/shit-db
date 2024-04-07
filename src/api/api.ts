export function createSheet(sheetName: string, header: string[]) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(sheetName)
  if (sheet) {
    sheet.clear()
  }
  sheet = spreadsheet.insertSheet(sheetName)
  sheet.appendRow(header)
}

export function createSheetToObjectMapper(sheetName: string, spreadsheetIdOrURL?: string): SheetToObjectMapper.SheetToObjectMapper {
  return SheetToObjectMapper.createSheetToObjectMapper(
    sheetName, spreadsheetIdOrURL
  )
}
