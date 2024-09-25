"use server";

export async function updateField(
  fieldId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>
) {
  const res = await fetch(`${process.env.BACKEND_URL}/fields/${fieldId}`, {
    headers: {
      "content-type": "application/json",
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
