"use server";
import { getSession } from "@/lib/auth/auth";

export default async function VerifyPublicationRequestPayment({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  try {
    const session: any = await getSession();

    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/payment/confirm/${publicationRequestId}`,
      {
        headers: {
          "cache-control": "no-cache",
          authorization: `Bearer ${session.user.accessToken}`,
          "content-type": "application/json",
        },
        method: "PATCH",
      }
    );

    const result = await res.json();

    return {
      status: res.status,
      body: result,
    };
  } catch (err) {}
}
