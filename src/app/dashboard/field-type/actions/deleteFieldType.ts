"use server";

import { getSession } from "@/lib/auth/auth";

export default async function deleteFieldType({
  fieldTypeId,
}: {
  fieldTypeId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/field-types/${fieldTypeId}`,
    {
      headers: {
        "cache-control": "no-cache",
      },
      method: "DELETE",
      cache: "no-store",
    }
  );

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
