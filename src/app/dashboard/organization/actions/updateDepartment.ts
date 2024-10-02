"use server";

import { createDepartment } from "../types";

export async function UpdateDepartment({
  payload,
  depId,
}: {
  payload: createDepartment;
  depId: string;
}) {
  const res = await fetch(`${process.env.BACKEND_URL}/departments/${depId}`, {
    headers: {
      "content-type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
