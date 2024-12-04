"use server";
import { getSession } from "@/lib/auth/auth";

export async function getPublicationRequest({ path = "" }: { path?: string }) {
  try {
    const session: any = await getSession();

    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/${path}`,
      {
        headers: {
          "cache-control": "no-cache",
          authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: "no-store",
      }
    );

    const result = await res.json();

    return {
      body: result,
      status: res.status,
    };
  } catch (err) {
    console.error("Error fetching publication request:", err);
    return {
      body: [],
      status: 400,
    };
  }
}
