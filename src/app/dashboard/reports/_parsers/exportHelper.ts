export const prepareDataForExport = (data: any[]) => {
    return data.map(row => {
        const cleanedRow: { [key: string]: any } = {};
        Object.entries(row).forEach(([key, value]) => {
            // Only include regular field names, exclude IDs and key
            if (!key.endsWith('_id') && key !== 'key') {
                cleanedRow[key] = value;
            }
        });
        return cleanedRow;
    });
};