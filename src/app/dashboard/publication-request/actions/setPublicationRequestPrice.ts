"use server";

import { getSession } from "@/lib/auth/auth";

export default async function SetPublicationRequestPriceAction({
  publicationRequestId,
  price,
}: {
  publicationRequestId: string;
  price: number;
}) {
  const session: any = await getSession();

  console.log("========= in here ==============");
  console.log(
    `${process.env.BACKEND_URL}/publication-request/payment-info-setup/${publicationRequestId}`
  );
  const res = await fetch(
    `${process.env.BACKEND_URL}/publication-request/payment-info-setup/${publicationRequestId}`,
    {
      headers: {
        "cache-control": "no-cache",
        authorization: `Bearer ${session.user.accessToken}`,
        "content-type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        price,
      }),
    }
  );

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
