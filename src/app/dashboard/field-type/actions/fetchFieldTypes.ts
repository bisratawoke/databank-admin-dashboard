"use server";

export async function FetchFieldTypes() {
  const res = await fetch(`${process.env.BACKEND_URL}/field-types`, {
    headers: {
      "Cache-Control": "no-cache",
    },
    cache: "no-cache",
  });

  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
