"use server";

import { createCategory } from "../types";

export async function CreateCategory(payload: createCategory) {
  const res = await fetch(`${process.env.BACKEND_URL}/categories`, {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
    method: "POST",
  });
  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
