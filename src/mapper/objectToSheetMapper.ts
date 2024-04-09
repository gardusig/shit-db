namespace ObjectToSheetMapper {
    export interface ObjectToSheetMapperInterface {
        appendObject: (obj: GenericObject, rowIndex: number) => void;
        appendObjects: (objs: GenericObject[], startIndex: number) => void;
    }
    export class ObjectToSheetMapper implements ObjectToSheetMapperInterface {
        sheet: GoogleAppsScript.Spreadsheet.Sheet
        header: string[]

        constructor(sheetName: string, header: string[], spreadsheetIdOrURL?: string) {
            const spreadsheet = Util.getSpreadsheet(spreadsheetIdOrURL)
            if (spreadsheet === null) {
                throw new Error(`Failed to find spreadsheet for ID or URL '${spreadsheetIdOrURL}'`)
            }
            this.sheet = Util.createSheet(sheetName, header, spreadsheet)
            this.header = header
        }

        appendObject(obj: GenericObject): void {
            appendObject(obj, this.sheet, this.header)
        }

        appendObjects(objs: GenericObject[]): void {
            appendObjects(objs, this.sheet, this.header)
        }
    }
}

function appendObject(obj: GenericObject, sheet: GoogleAppsScript.Spreadsheet.Sheet, header: string[]): void {
    const serializedObject = getSerializedObject(obj, header)
    sheet.appendRow(serializedObject)
}

function appendObjects(objs: GenericObject[], sheet: GoogleAppsScript.Spreadsheet.Sheet, header: string[]): void {
    objs.forEach(obj => {
        appendObject(obj, sheet, header)
    })
    const lastRowWithData = sheet.getLastRow()
    const maxRows = sheet.getMaxRows()
    const numRowsToRemove = maxRows - lastRowWithData
    Logger.log(`lastRowWithData: ${lastRowWithData}, maxRows: ${maxRows}, numRowsToRemove: ${numRowsToRemove}`)
    if (numRowsToRemove > 0) {
        sheet.deleteRows(lastRowWithData + 1, numRowsToRemove)
    }
}

function getSerializedObject(obj: GenericObject, header: string[]): any[] {
    const serializedObject: any[] = []
    header.forEach(headerKey => {
        serializedObject.push(obj[headerKey])
    })
    return serializedObject
}
