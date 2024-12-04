"use server";

import { getSession } from "@/lib/auth/auth";

export async function updateField(
  fieldId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>
) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/fields/${fieldId}`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: "PUT",
    body: JSON.stringify(values),
  });

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
