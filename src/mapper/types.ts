type SheetCellValue = string | number | boolean | Date;

type SheetRow = SheetCellValue[];

type GenericObject = Record<string, SheetCellValue>;

type HeaderMap = Record<string, number>;

interface SheetToObjectMapper<T> {
    getAllRows: () => T[];
    getRow: (rowIndex: number) => T | null;
    getRows: (startRowIndex: number, finishRowIndex: number) => T[];
    getHeaderMap: () => Map<string, number>;
}

export {
    GenericObject,
    HeaderMap,
    SheetRow,
};
