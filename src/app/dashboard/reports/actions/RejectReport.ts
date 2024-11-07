/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export default async function RejectReport({ reportId }: { reportId: string }) {
  const session: any = await getSession();

  const result = await fetch(
    `${process.env.BACKEND_URL}/reports/reject/${reportId}`,
    {
      headers: {
        authorization: "Bearer " + session.user.accessToken,
        cache: "no-cache",
      },
      method: "PATCH",
    }
  );

  const body = await result.json();
  return { status: result.status, body: body };
}
