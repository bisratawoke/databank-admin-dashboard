/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";
export default async function deletePublication({
  publicationId,
}: {
  publicationId: string;
}) {
  const session: any = await getSession();

  const result = await fetch(
    `${process.env.BACKEND_URL}/publications/${publicationId}`,
    {
      headers: {
        authorization: "Bearer " + session.user.accessToken,
        cache: "no-cache",
      },
      method: "delete",
    }
  );

  // const body = await result.json();
  return { status: result.status, body: "" };
}
