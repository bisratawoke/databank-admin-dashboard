"use server";
import { getSession } from "@/lib/auth/auth";

export default async function FetchPublicationRequests() {
  const session: any = await getSession();

  const res = await fetch(`${process.env.BACKEND_URL}/publication-request`, {
    headers: {
      authorization: `Bearer ${session?.user.accessToken}`,
      cache: "no-cache",
    },

    cache: "no-store",
    method: "GET",
  });

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
