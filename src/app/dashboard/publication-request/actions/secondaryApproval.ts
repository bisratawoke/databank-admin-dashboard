"use server";
import { getSession } from "@/lib/auth/auth";

export default async function SecondaryApproval({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  try {
    const session: any = await getSession();

    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/seconday-approval/${publicationRequestId}`,
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
