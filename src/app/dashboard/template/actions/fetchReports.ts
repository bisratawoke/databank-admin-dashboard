"use server";
import { getSession } from "@/lib/auth/auth";
const API_URL = process.env.BACKEND_URL;
export async function fetchReports() {
  const session: any = await getSession();
  try {
    const res = await fetch(`${API_URL}/reports`, {
      headers: {
        "Cache-Control": "no-store",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      cache: "no-cache",
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.log("=========== in action error =======");
    console.log(err);
  }
}

export async function fetchReport(id: string) {
  const session: any = await getSession();
  const res = await fetch(`${process.env.BACKEND_URL}/reports/${id}`, {
    headers: {
      "Cache-Control": "no-store",
      authorization: `Bearer ${session?.user.accessToken}`,
    },
    cache: "no-cache",
  });
  const result = await res.json();
  return result;
}
