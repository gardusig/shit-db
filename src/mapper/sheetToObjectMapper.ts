import {
  GenericObject,
  HeaderMap,
  SheetRow,
} from './types';

function createSheetToObjectMapper(sheetName: string) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet === null) {
    throw new Error(`Sheet with name '${sheetName}' not found.`);
  }
  const sheetRows: SheetRow[] = sheet.getDataRange().getValues();
  if (sheetRows.length < 1) {
    throw new Error("Empty sheet");
  }
  const headerMap = createHeaderMap(sheetRows[0]);
  return {
    getAllRows: function () {
      return createObjectList(
        headerMap,
        sheetRows,
      );
    },
    getRowAsObject: function (rowIndex: number) {
      return createObjectList(
        headerMap,
        sheetRows,
        rowIndex,
        rowIndex,
      );
    },
    getRowsAsObject: function (startRowIndex: number, finishRowIndex: number) {
      return createObjectList(
        headerMap,
        sheetRows,
        startRowIndex,
        finishRowIndex,
      );
    },
    getHeaderMap: function () {
      return deepCopyMap(headerMap);
    },
  };
}

function createHeaderMap(sheetHeaderRow: SheetRow): HeaderMap {
  if (!sheetHeaderRow || sheetHeaderRow.length === 0) {
    throw new Error("Empty header row");
  }
  const headerMap: HeaderMap = {};
  sheetHeaderRow.forEach(
    (sheetCellValue, columnIndex) => {
      if (typeof sheetCellValue !== 'string') {
        throw new Error(`Unexpected column name type at index ${columnIndex}`);
      }
      headerMap[sheetCellValue] = columnIndex;
    }
  );
  return headerMap;
}

function createObjectList(
  headerMap: HeaderMap,
  sheetRows: SheetRow[],
  startRowIndex = Number.MIN_SAFE_INTEGER,
  finishRowIndex = Number.MAX_SAFE_INTEGER,
): GenericObject[] {
  const objectList: GenericObject[] = [];
  startRowIndex = Math.max(startRowIndex, 1);
  finishRowIndex = Math.min(finishRowIndex, sheetRows.length);
  for (let rowIndex = startRowIndex; rowIndex < finishRowIndex; rowIndex++) {
    const genericObject: GenericObject = createObject(headerMap, sheetRows[rowIndex]);
    objectList.push(genericObject);
  }
  return objectList;
}

function createObject(
  headerMap: HeaderMap,
  sheetRow: SheetRow,
): GenericObject {
  const genericObject: GenericObject = {};
  Object.entries(headerMap).forEach(
    ([columnName, columnIndex]) => {
      const cellContent = sheetRow[columnIndex];
      if (cellContent !== undefined && cellContent !== null && cellContent !== "") {
        genericObject[columnName] = cellContent;
      }
    }
  )
  return genericObject;
}
