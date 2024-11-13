/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export default async function InitalRequestResponse({
  reportId,
  status,
}: {
  reportId: string;
  status: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/reports/initial-request-response/${reportId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        status: status,
      }),
    }
  );

  const result = await res.json();

  return {
    body: result,
    status: res.status,
  };
}
