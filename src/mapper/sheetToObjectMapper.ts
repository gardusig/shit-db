import {
  GenericObject,
  HeaderMap,
  SheetRow,
  SheetToObjectMapper,
} from './types'

export function createSheetToObjectMapper(
  sheetName: string,
  spreadsheetIdOrURL?: string,
): SheetToObjectMapper {
  const spreadsheet = getSpreadsheet(spreadsheetIdOrURL)
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
    getAllRows: function () {
      return createObjectList(headerMap, sheetRows)
    },
    getRow: function (rowIndex: number) {
      const objectList = createObjectList(headerMap, sheetRows, rowIndex, rowIndex)
      if (objectList.length === 0) {
        throw new Error('Index out of range')
      }
      return objectList[0]
    },
    getRows: function (startRowIndex: number, finishRowIndex: number) {
      return createObjectList(headerMap, sheetRows, startRowIndex, finishRowIndex)
    },
    getHeaderMap: function () {
      const copiedMap = deepCopy(headerMap)
      if (copiedMap === null) {
        throw new Error('Null header map')
      }
      return copiedMap
    },
  }
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

function isSpreadsheetUrl(value: string): boolean {
  return value.includes('spreadsheets.google.com')
}

function getSpreadsheet(
  spreadsheetIdOrURL?: string,
): GoogleAppsScript.Spreadsheet.Spreadsheet | null {
  if (spreadsheetIdOrURL) {
    if (isSpreadsheetUrl(spreadsheetIdOrURL)) {
      return SpreadsheetApp.openByUrl(spreadsheetIdOrURL)
    }
    return SpreadsheetApp.openById(spreadsheetIdOrURL)
  }
  return SpreadsheetApp.getActiveSpreadsheet()
}
