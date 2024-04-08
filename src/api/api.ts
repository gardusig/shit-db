export function createObjectToSheetMapper(sheetName: string, header: string[], spreadsheetIdOrURL?: string) {
  return ObjectToSheetMapper.createObjectToSheetMapper(
    sheetName, header, spreadsheetIdOrURL
  )
}

export function createSheetToObjectMapper(sheetName: string, spreadsheetIdOrURL?: string) {
  return SheetToObjectMapper.createSheetToObjectMapper(
    sheetName, spreadsheetIdOrURL
  )
}
