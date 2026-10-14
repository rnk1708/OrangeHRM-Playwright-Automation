const XLSX = require('xlsx');

class ExcelReader {

    static readExcel(filePath, sheetName) {
        const workbook = XLSX.readFile(filePath);
        const selectedSheetName = sheetName || workbook.SheetNames[0];
        const sheet = workbook.Sheets[selectedSheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        return data;
    }
}

module.exports = ExcelReader;