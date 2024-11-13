/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";

export async function fetchNotification() {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/notifire`, {
    headers: {
      cache: "no-store",
      authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-cache",
  });
  const result = await res.json();
  return {
    body: result,
  };
}
