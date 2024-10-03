"use server";

export async function UpdateFieldType({
  body,
  fieldId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: Record<string, any>;
  fieldId: string;
}) {
  const res = await fetch(`${process.env.BACKEND_URL}/field-types/${fieldId}`, {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
    method: "PUT",
  });

  const result = await res.json();
  return {
    body: result,
    status: res.status,
  };
}
