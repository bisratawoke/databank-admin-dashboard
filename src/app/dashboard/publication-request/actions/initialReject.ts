"use server";
import { getSession } from "@/lib/auth/auth";

export default async function InitalReject({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  try {
    const session: any = await getSession();

    ///initial-rejection/:publicationRequestId
    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/initial-rejection/${publicationRequestId}`,
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
