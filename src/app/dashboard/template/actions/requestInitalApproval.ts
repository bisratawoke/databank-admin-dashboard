/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export default async function RequestInitialApproval(reportId: string) {
  const session: any = await getSession();

  const result = await fetch(
    `${process.env.BACKEND_URL}/reports/request-initial-approval/${reportId}`,
    {
      headers: {
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      method: "POST",
    }
  );

  return { status: result.status };
}
