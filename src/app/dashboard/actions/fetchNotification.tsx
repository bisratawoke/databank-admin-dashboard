"use server";

export async function fetchNotification() {
  const res = await fetch(`${process.env.BACKEND_URL}/notifire`, {
    headers: {
      cache: "no-store",
    },
    cache: "no-cache",
  });
  const result = await res.json();
  return {
    body: result,
  };
}
