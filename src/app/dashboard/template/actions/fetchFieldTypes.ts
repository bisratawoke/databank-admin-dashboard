"use server";

export async function fetchFieldTypes() {
  const res = await fetch(`${process.env.BACKEND_URL}/field-types`, {
    headers: {
      "cache-control": "no-cache",
    },
    cache: "no-cache",
  });
  const result = await res.json();
  return result;
}
