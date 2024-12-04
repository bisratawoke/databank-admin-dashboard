/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";

export async function FetchUsers() {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/users`, {
    headers: {
      "cache-control": "no-cache",
      authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-cache",
  });

  console.log("===================== in fetch users ======================");
  console.log(session);
  const result = await res.json();
  return {
    status: res.status,
    body: result.users,
  };
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
    ],
  };
}
