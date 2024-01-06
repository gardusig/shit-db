type SheetCellValue = string | number | boolean | Date;

type SheetRow = SheetCellValue[];

type GenericObject = Record<string, SheetCellValue>;

type HeaderMap = Record<string, number>;

interface SheetToObjectMapper {
    getAllRows: () => GenericObject[];
    getRow: (rowIndex: number) => GenericObject;
    getRows: (startRowIndex: number, finishRowIndex: number) => GenericObject[];
    getHeaderMap: () => HeaderMap;
}

export {
    GenericObject,
    HeaderMap,
    SheetRow,
    SheetToObjectMapper,
};
