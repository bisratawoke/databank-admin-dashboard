/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";

export default async function RequestSecondApproval({
  reportId,
}: {
  reportId: string;
}) {
  const session: any = await getSession();
  const res = await fetch(
    `${process.env.BACKEND_URL}/reports/request-second-approval/${reportId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
      },
      method: "POST",
    }
  );

  const result = await res.json();

  return {
    result,
    status: res.status,
  };
}
