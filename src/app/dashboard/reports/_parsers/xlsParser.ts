import * as XLSX from 'xlsx';

export interface ParsedExcelData {
    headers: string[];
    data: any[]; // You can specify a more strict type if needed
}

// export const parseExcel = (file: File): Promise<ParsedExcelData> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const data = new Uint8Array(event.target.result as ArrayBuffer);
//             const workbook = XLSX.read(data, { type: 'array' });
//             const sheet = workbook.Sheets[workbook.SheetNames[0]];
//             const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//             const headers = jsonData[0] as string[];  // First row is the headers
//             const rows = jsonData.slice(1);  // Remaining rows are the data

//             resolve({
//                 headers,
//                 data: rows
//             });
//         };
//         reader.onerror = (error) => reject(error);
//         reader.readAsArrayBuffer(file);
//     });
// };

export const parseExcel = (file: File): Promise<ParsedExcelData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const data = new Uint8Array(event.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (jsonData.length === 0) {
                reject(new Error("No data found in the Excel file"));
                return;
            }

            const headers = jsonData[0] as string[];
            console.log("headers: ", headers);
            const rows = jsonData.slice(1).map((row: any) => {
                // Ensure we return an object for each row with header as keys
                return headers.reduce((acc: any, header, index) => {
                    acc[header] = row[index];
                    return acc;
                }, {});
            });

            resolve({
                headers,
                data: rows
            });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
