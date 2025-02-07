/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getSession } from "@/lib/auth/auth";

export async function hasRelatedData(id: string) {
  const session: any = await getSession();
  const res = await fetch(
    `${process.env.BACKEND_URL}/fields/related-data/${id}`,
    {
      headers: {
        "Cache-Control": "no-store",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      cache: "no-cache",
    }
  );
  const result = await res.json();
  return {
    body: result.length > 0,
  };
}
