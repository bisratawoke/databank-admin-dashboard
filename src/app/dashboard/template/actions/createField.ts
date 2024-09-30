"use server";

import { fields } from "../types";

export async function createField(field: fields) {
  const res = await fetch(`${process.env.BACKEND_URL}/fields`, {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(field),
    method: "POST",
  });
  const result = await res.json();
  return {
    result,
    status: res.status,
  };
}
