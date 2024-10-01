"use server";

import { Data } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function createData(dataEntries: { field: string; value: string }[]) {

    console.log("dataEntiries: ", dataEntries)
    const res = await fetch(`${API_URL}/data/bulk`, {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(dataEntries), // Wrap dataEntries in an object
        method: "POST",
    });
    const result = await res.json();

    return {
        result,
        status: res.status,
    };
}
