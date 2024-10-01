import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<{ headers: string[], data: any[] }> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results: any) => {
                resolve({
                    headers: Object.keys(results.data[0]),
                    data: results.data
                });
            },
            error: (error) => reject(error),
        });
    });
};