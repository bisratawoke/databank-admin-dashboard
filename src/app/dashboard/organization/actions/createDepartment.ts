"use server";

import { createDepartment } from "../types";

export async function CreateDepartment(data: createDepartment) {
  console.log(JSON.stringify(data));
  const res = await fetch(`${process.env.BACKEND_URL}/departments`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    cache: "no-cache",
    body: JSON.stringify(data),
    method: "POST",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}