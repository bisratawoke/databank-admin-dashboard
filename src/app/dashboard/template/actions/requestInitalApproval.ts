/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export default async function RequestInitialApproval(reportId: string) {
  console.log("=========== in request initial approval =============");
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
  console.log(result.status);

  return { status: result.status };
}
