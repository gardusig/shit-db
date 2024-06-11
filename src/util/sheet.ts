namespace Util.Sheet {
  export function getSpreadsheet(
    spreadsheetIdOrURL?: string,
  ): GoogleAppsScript.Spreadsheet.Spreadsheet | null {
    if (spreadsheetIdOrURL) {
      if (isSpreadsheetUrl(spreadsheetIdOrURL)) {
        return SpreadsheetApp.openByUrl(spreadsheetIdOrURL);
      }
      return SpreadsheetApp.openById(spreadsheetIdOrURL);
    }
    return SpreadsheetApp.getActiveSpreadsheet();
  }

  export function createSheet(
    sheetName: string,
    header: string[],
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  ): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet =
      spreadsheet.getSheetByName(sheetName) ??
      spreadsheet.insertSheet(sheetName);
    sheet.clear();
    sheet.appendRow(header);
    return sheet;
  }

  function isSpreadsheetUrl(value: string): boolean {
    return value.includes("spreadsheets.google.com");
  }
}
