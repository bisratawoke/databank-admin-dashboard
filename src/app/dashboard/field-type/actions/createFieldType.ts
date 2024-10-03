"use server";

import { FieldType } from "../type";

export async function createFieldType(payload: FieldType) {
  const res = await fetch(`${process.env.BACKEND_URL}/field-types`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
