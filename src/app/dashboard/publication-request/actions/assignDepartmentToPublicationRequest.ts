"use server";

import { getSession } from "@/lib/auth/auth";

export default async function assignDepartmentToPublicationRequest({
  requestId,
  departmentId,
}: {
  requestId: string;
  departmentId: string;
}) {
  try {
    const session: any = await getSession();

    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/assign-department/${requestId}`,
      {
        headers: {
          "cache-control": "no-cache",
          authorization: `Bearer ${session.user.accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          departmentId,
        }),
        cache: "no-cache",
        method: "PATCH",
      }
    );

    const result = await res.json();

    return {
      body: result,
      status: res.status,
    };
  } catch (err) {
    console.log(err);
    return {
      body: [],
      status: 400,
    };
  }
}
