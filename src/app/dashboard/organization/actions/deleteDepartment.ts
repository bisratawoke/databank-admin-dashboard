"use server";

export async function deletDepartment({ depId }: { depId: string }) {
  const res = await fetch(`${process.env.BACKEND_URL}/departments/${depId}`, {
    headers: {
      "content-type": "application/json",
    },
    method: "DELETE",
  });

  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
