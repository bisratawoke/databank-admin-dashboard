/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createSubCategory } from "../types";
import { getSession } from "@/lib/auth/auth";
export async function UpdateSubCategory({
  payload,
  subCategoryId,
}: {
  payload: createSubCategory;
  subCategoryId: string;
}) {
  const session: any = await getSession();
  const res = await fetch(
    `${process.env.BACKEND_URL}/subcategories/${subCategoryId}`,
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
