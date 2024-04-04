import { createSheetToObjectMapper } from '../mapper/sheetToObjectMapper'

export function testCreateSheetToObjectMapper() {
    const testSheetName = 'TestSheet_' + Math.floor(Math.random() * 1000000)
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.insertSheet(testSheetName)
    const headerValues = ['Name', 'Age', 'City']
    sheet.getRange(1, 1, 1, headerValues.length).setValues([headerValues])
    const sheetMapper = createSheetToObjectMapper(testSheetName)
    const headerMap = sheetMapper.getHeaderMap()
    // const expectedHeaderMap = {
    //     Name: 1,
    //     Age: 2,
    //     City: 3,
    // }
    console.log('headerMap:', headerMap)
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet)
}
