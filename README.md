# ShitDB

ShitDB is a JavaScript library designed to streamline data mapping between JavaScript objects and Google Sheets.

## Usage

### Installation

To use ShitDB, follow these steps:

1. Install CLASP (Google's Command Line Apps Script Projects tool) if you haven't already.
   
2. Clone this repository to your local machine.

3. Run `clasp login` to authenticate with your Google account.

4. Run `clasp push` to deploy the code to your Google Apps Script project.

### ObjectToSheetMapper

The `ObjectToSheetMapper` class provides functionality to map JavaScript objects to Google Sheets. It allows you to define a sheet with a specific header and append objects to it.

#### Constructor

- `sheetName`: The name of the sheet to which objects will be appended.
- `header`: An array containing the column headers for the sheet.
- `spreadsheetIdOrURL`: (Optional) The ID or URL of the Google Spreadsheet. If not provided, it defaults to the active spreadsheet.

#### Methods

- `appendObject(obj: GenericObject)`: Appends a single object to the sheet.
- `appendObjects(objs: GenericObject[])`: Appends an array of objects to the sheet.
- `trimRows()`: Removes empty rows from the bottom of the sheet.
- `trimColumns()`: Removes empty columns from the right of the sheet.

### SheetToObjectMapper

The `SheetToObjectMapper` class provides functionality to map Google Sheets data to JavaScript objects. It allows you to retrieve objects from a specified sheet.

#### Constructor

- `sheetName`: The name of the sheet from which objects will be retrieved.
- `spreadsheetIdOrURL`: (Optional) The ID or URL of the Google Spreadsheet. If not provided, it defaults to the active spreadsheet.

#### Methods

- `getAllObjects()`: Retrieves all objects from the sheet.
- `getObject(rowIndex: number)`: Retrieves a single object from the specified row index.
- `getObjectBatch(startRowIndex: number, finishRowIndex: number)`: Retrieves a batch of objects from the specified range of row indices.
- `getHeaderMap()`: Retrieves the header map, which maps column names to their respective indices in the sheet.

### Types

#### SheetCellValue
- Represents a value that can be stored in a Google Sheets cell. It can be a string, number, boolean, or Date.

#### SheetRow
- Represents a row of values in a Google Sheets spreadsheet. It is an array of SheetCellValue.

#### GenericObject
- Represents a generic JavaScript object, where keys are strings representing column names and values are SheetCellValue.

#### HeaderMap
- Represents a mapping of column names to their respective indices in the sheet.

### Additional Notes

- Ensure that the necessary permissions are granted to the Google Sheets API for the script to access the spreadsheet.
- This library assumes familiarity with Google Apps Script and basic JavaScript concepts.

## Examples

```ts
// Define a function to get a list of objects from a sheet
export function getObjectList<T>(sheetName: string): T[] {
    // Create a SheetToObjectMapper instance for the specified sheet
    const sheetMapper = new ShitDb.SheetToObjectMapper.SheetToObjectMapper(sheetName);

    // Retrieve all objects from the specified sheet
    const objectList = sheetMapper.getAllObjects() as T[];

    // Return the list of objects
    return objectList;
}

// Example usage:
// Assume you have a sheet named 'StockTransactions' with data in it
// Define an interface representing the structure of the objects in the sheet
interface StockTransaction {
    ticker: string;
    side: string;
    quantity: number;
    total: string;
    price: string;
}

// Retrieve the list of stock transactions from the 'StockTransactions' sheet
const stockTransactions = getObjectList<StockTransaction>('StockTransactions');

// Log the retrieved list of stock transactions
console.log(stockTransactions);
```
