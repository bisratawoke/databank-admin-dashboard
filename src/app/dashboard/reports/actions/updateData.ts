"use server";

import { Data } from "../types";

const API_URL = process.env.BACKEND_URL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateData = async ({ data }: { data: Data[] }): Promise<{ result?: any; status: number; error?: any }> => {
    console.log("data being sent: ", data)
    try {
        const response = await fetch(`${API_URL}/data/bulkUpdate`, {
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ data }),
            method: 'PUT',
        });

        const result = await response.json();

        return {
            result,
            status: response.status,
        };
    } catch (error) {
        console.error("Error updating report:", error);
        return {
            error,
            status: 500,
        };
    }
};
