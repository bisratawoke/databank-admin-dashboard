"use server";

export async function FetchTree() {
  const res = await fetch(`${process.env.BACKEND_URL}/departments`, {
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
