/**
 * Creates a mapper for converting sheet data to objects.
 *
 * @param {string} sheetName The name of the sheet to map.
 * @returns {object} An object with methods for accessing sheet data as objects.
 */
function createSheetToObjectMapper(
  sheetName,
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(sheetName);
  const sheetRows = sheet
    .getDataRange()
    .getValues();
  if (sheetRows.length < 1) {
    throw new Error("Empty sheet");
  }
  const headerMap = createHeaderMap(sheetRows[0]);
  return {
    getAllRowsAsObjectList: function () {
      return createObjectList(
        headerMap,
        sheetRows,
      );
    },
    getRowAsObject: function (rowIndex) {
      return createObjectList(
        sheetRows,
        headerMap,
        rowIndex,
        rowIndex,
      );
    },
    getRowsAsObject: function (startRowIndex, finishRowIndex) {
      return createObjectList(
        sheetRows,
        headerMap,
        startRowIndex,
        finishRowIndex,
      );
    },
    getHeaderMap: function () {
      return deepCopyMap(headerMap);
    },
  };
}

/**
 * Creates a header map from the given header row.
 *
 * @param {string[]} sheetHeaderRow The header row containing column names.
 * @returns {Map<string, number>} A map of column names to their indices.
 * @throws {Error} If the header row is empty.
 */
function createHeaderMap(
  sheetHeaderRow,
) {
  const headerMap = new Map();
  if (!sheetHeaderRow || sheetHeaderRow.length === 0) {
    throw new Error("Empty header row");
  }
  for (let columnIndex = 0; columnIndex < sheetHeaderRow.length; columnIndex++) {
    headerMap.set(sheetHeaderRow[columnIndex], columnIndex);
  }
  return headerMap;
}

/**
 * Creates an object from a sheet row and a header map.
 *
 * @param {string[]} sheetRow The row of data to convert.
 * @param {Map<string, number>} headerMap The header map for mapping column names to indices.
 * @returns {object} The created object.
 */
function createObject(
  sheetRow,
  headerMap,
) {
  const genericObject = {};
  for (const [columnName, columnIndex] of headerMap) {
    addFieldToObject(genericObject, sheetRow, columnName, columnIndex);
  }
  return genericObject;
}

/**
 * Adds a field to an object from a sheet row, header map, and column information.
 *
 * @param {object} genericObject The object to add the field to.
 * @param {string[]} sheetRow The row of data containing the field value.
 * @param {string} columnName The name of the field to add.
 * @param {number} columnIndex The index of the column containing the field value.
 * @throws {Error} If the column index is out of bounds for the sheet row.
 */
function addFieldToObject(
  genericObject,
  sheetRow,
  columnName,
  columnIndex,
) {
  if (columnIndex > sheetRow.length) {
    throw new Error(
      "Column index out of bounds for sheet row"
      + ", sheetRow: " + sheetRow
      + ", columnIndex: " + columnIndex
      + ", columnName: " + columnName
    )
  }
  const cellContent = sheetRow[columnIndex];
  if (cellContent !== undefined && cellContent !== null && cellContent !== "") {
    genericObject[columnName] = cellContent;
  }
}

/**
 * Creates a list of objects from sheet data, a header map, and optional row range.
 *
 * @param {Map<string, number>} headerMap The header map for mapping column names to indices.
 * @param {string[][]} sheetRows The array of sheet rows containing data.
 * @param {number} [startRowIndex=Number.MIN_SAFE_INTEGER] The starting row index (inclusive).
 * @param {number} [finishRowIndex=Number.MAX_SAFE_INTEGER] The ending row index (exclusive).
 * @returns {object[]} The list of created objects.
 */
function createObjectList(
  headerMap,
  sheetRows,
  startRowIndex = Number.MIN_SAFE_INTEGER,
  finishRowIndex = Number.MAX_SAFE_INTEGER,
) {
  const objectList = [];
  startRowIndex = Math.max(startRowIndex, 1);
  finishRowIndex = Math.min(finishRowIndex, sheetRows.length);
  for (let rowIndex = startRowIndex; rowIndex < finishRowIndex; rowIndex++) {
    const genericObject = createObject(sheetRows[rowIndex], headerMap);
    objectList.push(genericObject);
  }
  return objectList;
}
