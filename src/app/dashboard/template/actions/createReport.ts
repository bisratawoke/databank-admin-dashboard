/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { report } from "../types";
import { getSession } from "@/lib/auth/auth";
export async function createReport(report: report) {
  try {
    const session: any = await getSession();
    const res = await fetch(`${process.env.BACKEND_URL}/reports`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(report),
    });
    const result = await res.json();
    return {
      body: result,
      status: res.status,
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
    };
  }
}
