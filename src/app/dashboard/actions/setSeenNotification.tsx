/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getSession } from "@/lib/auth/auth";

interface INotification {
  message: string;
  user: string;
  seen: boolean;
  notificationId: string;
}

export default async function setSeenNotification(notification: INotification) {
  const session: any = await getSession();
  const res = await fetch(
    `${process.env.BACKEND_URL}/notifire/${notification.notificationId}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cache: "no-store",
        authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({
        message: notification.message,
        user: notification.user,
        seen: true,
      }),
      cache: "no-cache",
    }
  );

  const { body } = await res.json();

  return {
    status: res.status,
    body,
  };
}
