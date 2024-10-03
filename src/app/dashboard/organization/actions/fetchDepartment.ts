"use server";

export async function FetchDepartment() {
  const res = await fetch(`${process.env.BACKEND_URL}/departments`, {
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
