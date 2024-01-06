function testCreateHeaderMapValidRow() {
    const headerRow = ["Name", "Age", "City"];
    const headerMap = createHeaderMap(headerRow);
    if (headerMap.get("Name") !== 0) {
        throw new Error("Expected 0 for headerMap value Name");
    }
    if (headerMap.get("Age") !== 1) {
        throw new Error("Expected 1 for headerMap value Age");
    }
    if (headerMap.get("City") !== 2) {
        throw new Error("Expected 0 for headerMap value City");
    }
}

function testCreateHeaderMapEmptyRow() {
    const headerRow = [];
    assertThrows(createHeaderMap, headerRow);
}
