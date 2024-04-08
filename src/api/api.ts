export function createSheet(sheetName: string, header: string[]) {
  return Util.createSheet(sheetName, header)
}

export function createSheetToObjectMapper(sheetName: string, spreadsheetIdOrURL?: string) {
  return SheetToObjectMapper.createSheetToObjectMapper(
    sheetName, spreadsheetIdOrURL
  )
}
