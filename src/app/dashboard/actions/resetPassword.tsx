"use server";
import { getSession } from "@/lib/auth/auth";

export default async function resetPassword({
  newPassword,
}: {
  newPassword: string;
}) {
  const session: any = await getSession();

  const opt = {
    headers: {
      "content-type": "application/json",
      cache: "no-store",
      authorization: `Bearer ${session.user.accessToken}`,
    },
    method: "POST",
    body: JSON.stringify({
      password: newPassword,
    }),
  };

  const res = await fetch(
    `${process.env.BACKEND_URL}/auth/reset-password`,
    opt
  );
  await res.json();

  return {
    status: res.status,
  };
}
