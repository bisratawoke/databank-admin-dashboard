"use server";

export async function deleteCategory({ categoryId }: { categoryId: string }) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/categories/${categoryId}`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "DELETE",
    }
  );

  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
