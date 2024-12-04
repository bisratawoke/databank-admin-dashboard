"use server";
import { getSession } from "@/lib/auth/auth";
export async function CreateUser(data) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/users`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
      authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-cache",
    body: JSON.stringify({
      ...data,
    }),
    method: "POST",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
