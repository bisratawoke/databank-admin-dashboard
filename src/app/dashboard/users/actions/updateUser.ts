/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export async function UpdateUser({ data, id }: any) {
  const session: any = await getSession();

  const res = await fetch(`${process.env.BACKEND_URL}/users/${id}`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
      authorization: `Bearer ${session?.user.accessToken}`,
    },
    cache: "no-cache",
    body: JSON.stringify({
      ...data,
    }),
    method: "PATCH",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
