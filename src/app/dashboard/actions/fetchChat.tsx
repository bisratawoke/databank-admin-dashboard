"use server";
import { getSession } from "@/lib/auth/auth";
export default async function fetchChat({ subjectId }: { subjectId: string }) {
  const session = await getSession();

  const res = await fetch(
    `${process.env.BACKEND_URL}/chatter/subject/${subjectId}`,
    {
      headers: {
        cache: "no-store",
      },
    }
  );

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
