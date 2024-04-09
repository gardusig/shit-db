export function createObjectToSheetMapper(sheetName: string, header: string[], spreadsheetIdOrURL?: string) {
  return new ObjectToSheetMapper.ObjectToSheetMapper(
    sheetName, header, spreadsheetIdOrURL
  )
}

export function createSheetToObjectMapper(sheetName: string, spreadsheetIdOrURL?: string) {
  return new SheetToObjectMapper.SheetToObjectMapper(
    sheetName, spreadsheetIdOrURL
  )
}
