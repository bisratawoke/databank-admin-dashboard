"use server";

import { createCategory } from "../types";

export async function UpdateCategory({
  payload,
  categoryId,
}: {
  payload: createCategory;
  categoryId: string;
}) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/categories/${categoryId}`,
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
