"use server";
import { getSession } from "@/lib/auth/auth";
export default async function deactivateUser(userId) {
  const session: any = await getSession();

  const res = await fetch(`${process.env.BACKEND_URL}/users/${userId}`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
      "content-type": "application/json",
      cache: "no-cache",
    },
    body: JSON.stringify({
      isActive: false,
    }),
    method: "PATCH",
  });
  const result = await res.json();

  return {
    body: result,
    status: res.status,
  };
}
