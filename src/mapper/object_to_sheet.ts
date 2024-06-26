namespace Mapper {
  export class ObjectToSheet {
    private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private readonly header: string[];

    constructor(
      sheetName: string,
      header: string[],
      spreadsheetIdOrURL?: string,
    ) {
      const spreadsheet = Util.Sheet.getSpreadsheet(spreadsheetIdOrURL);
      if (spreadsheet === null) {
        throw new Error(
          `Failed to find spreadsheet for ID or URL '${spreadsheetIdOrURL}'`,
        );
      }
      this.sheet = Util.Sheet.createSheet(sheetName, header, spreadsheet);
      this.header = header;
    }

    appendObject(obj: GenericObject): void {
      const serializedObject = this.getSerializedObject(obj);
      this.sheet.appendRow(serializedObject);
    }

    appendObjects(objs: GenericObject[]): void {
      objs.forEach((obj) => {
        this.appendObject(obj);
      });
    }

    private getSerializedObject(obj: GenericObject): any[] {
      const serializedObject: any[] = [];
      this.header.forEach((key) => {
        serializedObject.push(obj[key]);
      });
      return serializedObject;
    }
  }
}
