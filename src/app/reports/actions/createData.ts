"use server";

import { Data } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createData(data: Data[]) {
    const res = await fetch(`${API_URL}/data`, {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
        method: "POST",
    });
    console.log(res.status);
    const result = await res.json();
    console.log(result);
    return {
        result,
        status: res.status,
    };
}
