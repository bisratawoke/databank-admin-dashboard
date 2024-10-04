"use server";

import { createSubCategory } from "../types";

export async function CreateSubCategory(payload: createSubCategory) {
  const res = await fetch(`${process.env.BACKEND_URL}/subcategories`, {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    cache: "no-cache",
    method: "POST",
    body: JSON.stringify({
      ...payload,
      report: payload.report ? payload.report : [],
    }),
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
