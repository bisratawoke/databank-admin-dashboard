"use server";

import { createDepartment } from "../types";

export async function CreateDepartment(data: createDepartment) {
  const res = await fetch(`${process.env.BACKEND_URL}/departments`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    cache: "no-cache",
    body: JSON.stringify({
      ...data,
      category: data.category ? data.category : [],
    }),
    method: "POST",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
