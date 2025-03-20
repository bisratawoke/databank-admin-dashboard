"use server";
import { getSession } from "@/lib/auth/auth";

export default async function updateReport({
  reportId,
  payload,
}: {
  reportId: string;
  payload: Record<string, any>;
}) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/reports/${reportId}`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
