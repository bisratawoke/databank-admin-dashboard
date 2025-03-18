/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";

export async function FetchUsers(): Promise<any> {
  try {
    const session: any = await getSession();
    const res = await fetch(`${process.env.BACKEND_URL}/users`, {
      headers: {
        "cache-control": "no-cache",
        authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-cache",
    });

    console.log("======== fetch users ===============");
    console.log(res.status);
    const result = await res.json();
    console.log(result);
    return {
      status: res.status,
      body: result.users,
    };
  } catch (err) {
    console.log(err);
  }
}

export async function FetchRoles() {
  return {
    status: 200,
    body: [
      "ADMIN",
      "DEPARTMENT_HEAD",
      "DEPARTMENT_EXPERT",
      "DISSEMINATION_HEAD",
      "DISSEMINATION_EXPERT",
      "DEPUTY_DIRECTOR",
      "FINANCIAL_OFFICER",
    ],
  };
}
