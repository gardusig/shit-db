export function createObjectToSheetMapper(
  sheetName: string,
  header: string[],
  spreadsheetIdOrURL?: string,
): ObjectToSheetMapper.ObjectToSheetMapperInterface {
  return new ObjectToSheetMapper.ObjectToSheetMapper(
    sheetName, header, spreadsheetIdOrURL
  )
}

export function createSheetToObjectMapper(
  sheetName: string,
  spreadsheetIdOrURL?: string,
): SheetToObjectMapper.SheetToObjectMapperInterface {
  return new SheetToObjectMapper.SheetToObjectMapper(
    sheetName, spreadsheetIdOrURL
  )
}
