"use server";
import { getSession } from "@/lib/auth/auth";

export default async function InitalApproval({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  try {
    const session: any = await getSession();

    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/initial-approval/${publicationRequestId}`,
      {
        headers: {
          "cache-control": "no-cache",
          authorization: `Bearer ${session.user.accessToken}`,
        },
        method: "PATCH",
        cache: "no-store",
      }
    );

    const result = await res.json();

    return {
      body: result,
      status: res.status,
    };
  } catch (err) {}
}
