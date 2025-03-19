/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export async function RequestInitialApproval({
  departmentId,
}: {
  departmentId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/publication-request/request-initial-approval/${departmentId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  // const result = await res.json();

  return {
    body: "",
    status: res.status,
  };
}
