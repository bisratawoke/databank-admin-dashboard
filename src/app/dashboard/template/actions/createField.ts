/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { fields } from "../types";
import { getSession } from "@/lib/auth/auth";
export async function createField(field: fields) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/fields`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session.user.accessToken}`,
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
