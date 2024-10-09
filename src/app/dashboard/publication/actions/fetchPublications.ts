"use server";

export async function FetchPublications() {
  const res = await fetch(`${process.env.BACKEND_URL}/publications`, {
    headers: {
      "cache-control": "no-cache",
    },
    cache: "no-cache",
  });

  const result = await res.json();

  return {
    body: result,
    status: res.status,
  };
}
