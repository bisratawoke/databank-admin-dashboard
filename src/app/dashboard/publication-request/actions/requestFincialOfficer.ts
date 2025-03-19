/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export async function requestFinianceOfficer({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/publication-request/request-finiance-officer/${publicationRequestId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  // const result = await res.json();

  return {
    body: "",
    status: res.status,
  };
}

export async function requestDeputy({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/publication-request/request-deputy/${publicationRequestId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  // const result = await res.json();

  return {
    body: "",
    status: res.status,
  };
}

export async function requestDissiminationHead({
  publicationRequestId,
}: {
  publicationRequestId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/publication-request/request-dissmination-approved/${publicationRequestId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  // const result = await res.json();

  return {
    body: "",
    status: res.status,
  };
}
