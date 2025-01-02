"use server";
import { getSession } from "@/lib/auth/auth";

export default async function setFilePath({
  publicationRequestId,
  filePath,
}: {
  publicationRequestId: string;
  filePath: string;
}) {
  try {
    const session: any = await getSession();

    const res = await fetch(
      `${process.env.BACKEND_URL}/publication-request/set-file/${publicationRequestId}`,
      {
        headers: {
          "cache-control": "no-cache",
          authorization: `Bearer ${session.user.accessToken}`,
          "content-type": "application/json",
        },
        method: "PATCH",
        cache: "no-store",
        body: JSON.stringify({
          filePath,
        }),
      }
    );

    const result = await res.json();

    return {
      body: result,
      status: res.status,
    };
  } catch (err) {}
}
