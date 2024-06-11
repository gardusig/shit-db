# ShitDB

ShitDB is a JavaScript library designed to streamline data mapping between JavaScript objects and Google Sheets.

## Description

ShitDB facilitates easy and efficient mapping of data between JavaScript objects and Google Sheets. It provides utilities to serialize and deserialize data, allowing for seamless integration with Google Sheets for data storage and retrieval.

## Installation

To use ShitDB, follow these steps:

1. **Install CLASP** (Google's Command Line Apps Script Projects tool) if you haven't already.

    ```bash
    npm install -g @google/clasp
    ```

2. **Clone this repository** to your local machine.

    ```bash
    git clone https://github.com/yourusername/shit-db.git
    cd shit-db
    ```

3. **Authenticate with your Google account**.

    ```bash
    clasp login
    ```

4. **Deploy the code** to your Google Apps Script project.

    ```bash
    clasp push
    ```

## Usage

### ObjectToSheetMapper

The `ObjectToSheetMapper` class provides functionality to map JavaScript objects to Google Sheets. It allows you to define a sheet with a specific header and append objects to it.

#### Constructor

```typescript
constructor(sheetName: string, header: string[], spreadsheetIdOrURL?: string)
```

- `sheetName`: The name of the sheet to which objects will be appended.
- `header`: An array containing the column headers for the sheet.
- `spreadsheetIdOrURL`: (Optional) The ID or URL of the Google Spreadsheet. If not provided, it defaults to the active spreadsheet.

#### Methods

```typescript
appendObject(obj: GenericObject): void
```

Appends a single object to the sheet.

```typescript
appendObjects(objs: GenericObject[]): void
```

Appends an array of objects to the sheet.

```typescript
trimRows(): void
```

Removes empty rows from the bottom of the sheet.

```typescript
trimColumns(): void
```

Removes empty columns from the right of the sheet.

### SheetToObjectMapper

The `SheetToObjectMapper` class provides functionality to map Google Sheets data to JavaScript objects. It allows you to retrieve objects from a specified sheet.

#### Constructor

```typescript
constructor(sheetName: string, spreadsheetIdOrURL?: string)
```

- `sheetName`: The name of the sheet from which objects will be retrieved.
- `spreadsheetIdOrURL`: (Optional) The ID or URL of the Google Spreadsheet. If not provided, it defaults to the active spreadsheet.

#### Methods

```typescript
getAllObjects(): GenericObject[]
```

Retrieves all objects from the sheet.

```typescript
getObject(rowIndex: number): GenericObject | null
```

Retrieves a single object from the specified row index.

```typescript
getObjectBatch(startRowIndex: number, finishRowIndex: number): GenericObject[]
```

Retrieves a batch of objects from the specified range of row indices.

```typescript
getHeaderMap(): HeaderMap | null
```

Retrieves the header map, which maps column names to their respective indices in the sheet.

### Types

#### SheetCellValue

Represents a value that can be stored in a Google Sheets cell. It can be a string, number, boolean, or Date.

```typescript
type SheetCellValue = string | number | boolean | Date;
```

#### SheetRow

Represents a row of values in a Google Sheets spreadsheet. It is an array of SheetCellValue.

```typescript
type SheetRow = SheetCellValue[];
```

#### GenericObject

Represents a generic JavaScript object, where keys are strings representing column names and values are SheetCellValue.

```typescript
type GenericObject = Record<string, SheetCellValue>;
```

#### HeaderMap

Represents a mapping of column names to their respective indices in the sheet.

```typescript
type HeaderMap = Record<string, number>;
```

## Examples

Define a function to get a list of objects from a sheet

```typescript
export function getObjectList<T>(sheetName: string): T[] {
    const sheetMapper = new ShitDb.SheetToObjectMapper.SheetToObjectMapper(sheetName);
    const objectList = sheetMapper.getAllObjects() as T[];
    return objectList;
}

// Example usage:
interface StockTransaction {
    ticker: string;
    side: string;
    quantity: number;
    total: string;
    price: string;
}

const stockTransactions = getObjectList<StockTransaction>('StockTransactions');
console.log(stockTransactions);
```

### Additional Notes

- Ensure that the necessary permissions are granted to the Google Sheets API for the script to access the spreadsheet.
- This library assumes familiarity with Google Apps Script and basic JavaScript concepts.
