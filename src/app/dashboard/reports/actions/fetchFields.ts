"use server";

export async function fetchFields(id: string) {
    const res = await fetch(`${process.env.BACKEND_URL}/reports/${id}`, {
        headers: {
            "Cache-Control": "no-store",
        },
        cache: "no-cache",
    });
    const result = await res.json();
    return result;
}