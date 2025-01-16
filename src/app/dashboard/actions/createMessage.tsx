"use server";
import { getSession } from "@/lib/auth/auth";

export default async function createMessage({
  message,
  chatterId,
}: {
  message: string;
  chatterId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(`${process.env.BACKEND_URL}/chatter/${chatterId}`, {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      message,
      userId: session?.user._id,
    }),
    method: "POST",
  });
  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
