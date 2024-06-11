namespace Mapper {
  export class SheetToObject {
    private readonly headerMap: HeaderMap;
    private readonly sheetRows: SheetRow[];

    constructor(sheetName: string, spreadsheetIdOrURL?: string) {
      const spreadsheet = Util.Sheet.getSpreadsheet(spreadsheetIdOrURL);
      if (spreadsheet === null) {
        throw new Error(
          `Failed to find spreadsheet for ID or URL '${spreadsheetIdOrURL}'`,
        );
      }
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet === null) {
        throw new Error(`Sheet '${sheetName}' not found.`);
      }
      this.sheetRows = sheet.getDataRange().getValues();
      if (this.sheetRows.length < 1) {
        throw new Error("Empty sheet");
      }
      this.headerMap = createHeaderMap(this.sheetRows[0]);
    }

    getAllObjects(): GenericObject[] {
      return this.createObjectList();
    }

    getObject(rowIndex: number): GenericObject | null {
      return this.createObjectFromRow(rowIndex);
    }

    getObjectBatch(
      startRowIndex: number,
      finishRowIndex: number,
    ): GenericObject[] {
      return this.createObjectList(startRowIndex, finishRowIndex);
    }

    getHeaderMap(): HeaderMap | null {
      return deepCopy(this.headerMap);
    }

    private createObjectList(
      startRowIndex?: number,
      finishRowIndex?: number,
    ): GenericObject[] {
      startRowIndex = startRowIndex ?? Number.MIN_SAFE_INTEGER;
      finishRowIndex = finishRowIndex ?? Number.MAX_SAFE_INTEGER;
      const objectList: GenericObject[] = [];
      startRowIndex = Math.max(startRowIndex, 1);
      finishRowIndex = Math.min(finishRowIndex, this.sheetRows.length);
      for (
        let rowIndex = startRowIndex;
        rowIndex < finishRowIndex;
        rowIndex++
      ) {
        const genericObject: GenericObject = this.createObject(
          this.sheetRows[rowIndex],
        );
        objectList.push(genericObject);
      }
      return objectList;
    }

    private createObject(sheetRow: SheetRow): GenericObject {
      const genericObject: GenericObject = {};
      for (const [columnName, columnIndex] of Object.entries(this.headerMap)) {
        const cellContent = sheetRow[columnIndex];
        if (
          cellContent !== undefined &&
          cellContent !== null &&
          cellContent !== ""
        ) {
          genericObject[columnName] = cellContent;
        }
      }
      return genericObject;
    }

    private createObjectFromRow(rowIndex: number) {
      const objectList = this.createObjectList(rowIndex, rowIndex);
      if (objectList.length === 0) {
        return null;
      }
      return objectList[0];
    }
  }

  function deepCopy<T extends DeepCopyable>(obj: T | null): T | null {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((element) => deepCopy(element)) as T;
    }
    const newObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = deepCopy((obj as any)[key]);
      }
    }
    return newObj;
  }

  function createHeaderMap(sheetHeaderRow: SheetRow): HeaderMap {
    if (!sheetHeaderRow || sheetHeaderRow.length === 0) {
      throw new Error("Empty header row");
    }
    const headerMap: HeaderMap = {};
    sheetHeaderRow.forEach((sheetCellValue, columnIndex) => {
      if (typeof sheetCellValue !== "string") {
        throw new Error(`Unexpected column name type at index ${columnIndex}`);
      }
      headerMap[sheetCellValue] = columnIndex;
    });
    return headerMap;
  }
}

type SheetCellValue = string | number | boolean | Date;
type SheetRow = SheetCellValue[];
type GenericObject = Record<string, SheetCellValue>;
type HeaderMap = Record<string, number>;
type DeepCopyable = Record<string, any> | any[];
