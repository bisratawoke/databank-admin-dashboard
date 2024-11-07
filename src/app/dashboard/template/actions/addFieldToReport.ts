/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { fields } from "../types";
import { getSession } from "@/lib/auth/auth";
export async function addFieldToReport({
  reportId,
  field,
}: {
  reportId: string;
  field: fields;
}) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/reports/${reportId}`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session.user.accessToken}`,
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
