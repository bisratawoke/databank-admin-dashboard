"use server";
import { getSession } from "@/lib/auth/auth";
export async function FetchPublications({ path = "" }: { path?: string }) {
  try {
    const session: any = await getSession();
    const res = await fetch(
      `${process.env.BACKEND_URL}/publications?path=${path}`,
      {
        headers: {
          "cache-control": "no-cache",
          authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: "no-cache",
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
