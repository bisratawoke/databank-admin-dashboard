"use server";

import { Data } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const updateReport = async (reportId: string, data: Data[]): Promise<void> => {
    const response = await fetch(`${API_URL}/reports/${reportId}`, {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ data }),
        method: 'PUT',
    });
    if (!response.ok) {
        const error = new Error('Failed to update report');
        try {
            const errorJson = await response.json();
            error.message += `: ${errorJson.message}`;
        } catch (error) {
            console.error('Failed to parse error response from server', error);
        }
        console.error(error);
        throw error;
    }
};
