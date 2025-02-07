"use server";

import { getSession } from "@/lib/auth/auth";

export async function deleteField(fieldId: string) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/fields/${fieldId}`, {
    headers: {
      authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: "delete",
  });
  console.log(res.status);
  return { status: res.status };
}
