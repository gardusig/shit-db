namespace ObjectToSheetMapper {
    export function createObjectToSheetMapper(
        sheetName: string, header: string[], spreadsheetIdOrURL?: string,
    ): ObjectToSheetMapper {
        const spreadsheet = Util.getSpreadsheet(spreadsheetIdOrURL)
        if (spreadsheet === null) {
            throw new Error(`Failed to find spreadsheet for ID or URL '${spreadsheetIdOrURL}'`)
        }
        const sheet = Util.createSheet(sheetName, header, spreadsheet)
        return {
            appendObject: (obj: GenericObject) =>
                appendObject(obj, sheet, header),
            appendObjects: (objs: GenericObject[]) =>
                appendObjects(objs, sheet, header),
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
}

function getSerializedObject(obj: GenericObject, header: string[]): any[] {
    const serializedObject: any[] = []
    header.forEach(headerKey => {
        serializedObject.push(obj[headerKey])
    })
    return serializedObject
}

interface ObjectToSheetMapper {
    appendObject: (obj: GenericObject, rowIndex: number) => void;
    appendObjects: (objs: GenericObject[], startIndex: number) => void;
}
