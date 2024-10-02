"use server";

import { createSubCategory } from "../types";

export async function UpdateSubCategory({
  payload,
  subCategoryId,
}: {
  payload: createSubCategory;
  subCategoryId: string;
}) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/subcategories/${subCategoryId}`,
    {
      headers: {
        "content-type": "application/json",
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
