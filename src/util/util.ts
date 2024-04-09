namespace Util {
  export function deepCopy<T extends DeepCopyable>(obj: T | null): T | null {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    if (Array.isArray(obj)) {
      return obj.map(element => deepCopy(element)) as T
    }
    const newObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = deepCopy((obj as any)[key])
      }
    }
    return newObj
  }

  export function getSpreadsheet(spreadsheetIdOrURL?: string): GoogleAppsScript.Spreadsheet.Spreadsheet | null {
    if (spreadsheetIdOrURL) {
      if (isSpreadsheetUrl(spreadsheetIdOrURL)) {
        return SpreadsheetApp.openByUrl(spreadsheetIdOrURL)
      }
      return SpreadsheetApp.openById(spreadsheetIdOrURL)
    }
    return SpreadsheetApp.getActiveSpreadsheet()
  }

  export function createSheet(sheetName: string, header: string[], spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet): GoogleAppsScript.Spreadsheet.Sheet {
    if (spreadsheet === undefined) {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    }
    let sheet = spreadsheet.getSheetByName(sheetName)
    if (sheet) {
      sheet.clear()
    } else {
      sheet = spreadsheet.insertSheet(sheetName)
    }
    sheet.appendRow(header)
    const desiredNumColumns = header.length
    const currentNumColumns = sheet.getLastColumn()
    Logger.log(`desiredNumColumns: ${desiredNumColumns}, currentNumColumns: ${currentNumColumns}`)
    if (currentNumColumns > desiredNumColumns) {
      Logger.log(`desiredNumColumns + 1: ${desiredNumColumns + 1}, currentNumColumns - desiredNumColumns: ${currentNumColumns - desiredNumColumns}`)
      sheet.deleteColumns(desiredNumColumns + 1, currentNumColumns - desiredNumColumns)
    }
    const afterNumColumns = sheet.getLastColumn()
    Logger.log(`afterNumColumns: ${afterNumColumns}`)
    return sheet
  }
}

function isSpreadsheetUrl(value: string): boolean {
  return value.includes('spreadsheets.google.com')
}

type DeepCopyable = Record<string, any> | any[]
