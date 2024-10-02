"use server";

export async function FetchSubCategories() {
  const res = await fetch(`${process.env.BACKEND_URL}/subcategories`, {
    headers: {
      "cache-control": "no-cache",
    },
    cache: "no-cache",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
