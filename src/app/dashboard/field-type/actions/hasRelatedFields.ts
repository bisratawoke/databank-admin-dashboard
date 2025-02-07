"use server";

export default async function hasRelatedFields({
  fieldTypeId,
}: {
  fieldTypeId: string;
}) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/field-types/related-fields/${fieldTypeId}`,
    {
      headers: {
        "Cache-Control": "no-cache",
      },
      cache: "no-cache",
    }
  );

  const result = await res.json();
  return {
    status: res.status,
    body: result.length > 0,
  };
}
