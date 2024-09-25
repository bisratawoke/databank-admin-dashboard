"use server";

export async function deleteField(fieldId: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/fields/${fieldId}`, {
    method: "delete",
  });
  return { status: res.status };
}
