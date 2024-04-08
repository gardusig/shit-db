namespace SheetToObjectMapper {
  export function createSheetToObjectMapper(
    sheetName: string,
    spreadsheetIdOrURL?: string,
  ): SheetToObjectMapperInterface {
    const spreadsheet = Util.getSpreadsheet(spreadsheetIdOrURL)
    if (spreadsheet === null) {
      throw new Error(`Failed to find spreadsheet for ID or URL '${spreadsheetIdOrURL}'`)
    }
    const sheet = spreadsheet.getSheetByName(sheetName)
    if (sheet === null) {
      throw new Error(`Sheet '${sheetName}' not found.`)
    }
    const sheetRows: SheetRow[] = sheet.getDataRange().getValues()
    if (sheetRows.length < 1) {
      throw new Error('Empty sheet')
    }
    const headerMap = createHeaderMap(sheetRows[0])
    return {
      getAllObjects: () =>
        createObjectList(headerMap, sheetRows),
      getObject: (rowIndex: number) =>
        createObjectFromRow(headerMap, sheetRows, rowIndex),
      getObjectBatch: (startRowIndex: number, finishRowIndex: number) =>
        createObjectList(headerMap, sheetRows, startRowIndex, finishRowIndex),
      getHeaderMap: () =>
        Util.deepCopy(headerMap),
    }
  }
}

function createObjectList(
  headerMap: HeaderMap,
  sheetRows: SheetRow[],
  startRowIndex = Number.MIN_SAFE_INTEGER,
  finishRowIndex = Number.MAX_SAFE_INTEGER,
): GenericObject[] {
  const objectList: GenericObject[] = []
  startRowIndex = Math.max(startRowIndex, 1)
  finishRowIndex = Math.min(finishRowIndex, sheetRows.length)
  for (let rowIndex = startRowIndex; rowIndex < finishRowIndex; rowIndex++) {
    const genericObject: GenericObject = createObject(headerMap, sheetRows[rowIndex])
    objectList.push(genericObject)
  }
  return objectList
}

function createObject(
  headerMap: HeaderMap,
  sheetRow: SheetRow,
): GenericObject {
  const genericObject: GenericObject = {}
  Object.entries(headerMap).forEach(
    ([columnName, columnIndex]) => {
      const cellContent = sheetRow[columnIndex]
      if (cellContent !== undefined && cellContent !== null && cellContent !== '') {
        genericObject[columnName] = cellContent
      }
    }
  )
  return genericObject
}

function createHeaderMap(sheetHeaderRow: SheetRow): HeaderMap {
  if (!sheetHeaderRow || sheetHeaderRow.length === 0) {
    throw new Error('Empty header row')
  }
  const headerMap: HeaderMap = {}
  sheetHeaderRow.forEach(
    (sheetCellValue, columnIndex) => {
      if (typeof sheetCellValue !== 'string') {
        throw new Error(`Unexpected column name type at index ${columnIndex}`)
      }
      headerMap[sheetCellValue] = columnIndex
    }
  )
  return headerMap
}

function createObjectFromRow(headerMap: HeaderMap, sheetRows: SheetRow[], rowIndex: number) {
  const objectList = createObjectList(headerMap, sheetRows, rowIndex, rowIndex)
  if (objectList.length === 0) {
    return null
  }
  return objectList[0]
}

type SheetCellValue = string | number | boolean | Date;
type SheetRow = SheetCellValue[];
type GenericObject = Record<string, SheetCellValue>;
type HeaderMap = Record<string, number>;

interface SheetToObjectMapperInterface {
  getAllObjects: () => GenericObject[];
  getObject: (rowIndex: number) => GenericObject | null;
  getObjectBatch: (startRowIndex: number, finishRowIndex: number) => GenericObject[];
  getHeaderMap: () => HeaderMap | null;
}
