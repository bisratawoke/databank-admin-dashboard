"use server";
import { getSession } from "@/lib/auth/auth";
export default async function deleteUser(userId) {
  const session: any = await getSession();

  console.log("====== in delete user =============");
  const res = await fetch(`${process.env.BACKEND_URL}/users/${userId}`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,

      cache: "no-cache",
    },

    method: "delete",
  });
  console.log(res.status);
  const result = await res.json();

  return {
    body: result,
    status: res.status,
  };
}
