"use server";
import { getSession } from "@/lib/auth/auth";
export default async function deleteUser(userId: any) {
  const session: any = await getSession();

  const res = await fetch(`${process.env.BACKEND_URL}/users/${userId}`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,

      cache: "no-cache",
    },

    method: "delete",
  });
  const result = await res.json();

  return {
    body: result,
    status: res.status,
  };
}
