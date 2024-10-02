"use server";

export async function FetchCategories() {
  const res = await fetch(`${process.env.BACKEND_URL}/categories`, {
    headers: {
      "cache-control": "no-cache",
    },
    cache: "no-store",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
