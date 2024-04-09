namespace ObjectToSheetMapper {
    export class ObjectToSheetMapper {
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
            const serializedObject = this.getSerializedObject(obj)
            this.sheet.appendRow(serializedObject)
        }

        appendObjects(objs: GenericObject[]): void {
            objs.forEach(obj => { this.appendObject(obj) })
        }

        trimRows(): void {
            const lastRowWithData = this.sheet.getLastRow()
            const maxRows = this.sheet.getMaxRows()
            const numRowsToRemove = maxRows - lastRowWithData
            if (numRowsToRemove > 0) {
                this.sheet.deleteRows(lastRowWithData + 1, numRowsToRemove)
            }
        }

        trimColumns(): void {
            const lastColumnWithData = this.sheet.getLastColumn()
            const maxColumns = this.sheet.getMaxColumns()
            const columnsToRemove = maxColumns - lastColumnWithData
            if (columnsToRemove > 0) {
                this.sheet.deleteColumns(lastColumnWithData + 1, columnsToRemove)
            }
        }

        private getSerializedObject(obj: GenericObject): any[] {
            const serializedObject: any[] = []
            this.header.forEach(key => { serializedObject.push(obj[key]) })
            return serializedObject
        }
    }
}
