"use server";

import { fields } from "../types";

export async function addFieldToReport({
  reportId,
  field,
}: {
  reportId: string;
  field: fields;
}) {
  const res = await fetch(`${process.env.BACKEND_URL}/reports/${reportId}`, {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields: [field] }),
    method: "PUT",
  });
  const result = await res.json();
  return {
    status: res.status,
    result: result,
  };
}
