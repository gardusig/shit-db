namespace Util {
  export class Formatter {
    private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

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
      this.sheet = sheet;
    }

    trim(): void {
      this.trimColumns();
      this.trimRows();
    }

    trimRows(): void {
      const lastRowWithData = this.sheet.getLastRow();
      const maxRows = this.sheet.getMaxRows();
      const numRowsToRemove = maxRows - lastRowWithData;
      if (numRowsToRemove > 0) {
        this.sheet.deleteRows(lastRowWithData + 1, numRowsToRemove);
      }
    }

    trimColumns(): void {
      const lastColumnWithData = this.sheet.getLastColumn();
      const maxColumns = this.sheet.getMaxColumns();
      const columnsToRemove = maxColumns - lastColumnWithData;
      if (columnsToRemove > 0) {
        this.sheet.deleteColumns(lastColumnWithData + 1, columnsToRemove);
      }
    }
  }
}
