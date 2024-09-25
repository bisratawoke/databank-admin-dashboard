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
  console.log(res.status);
  const result = await res.json();
  console.log(result);
  return {
    result,
    status: res.status,
  };
}
