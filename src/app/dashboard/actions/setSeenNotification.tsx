"use server";

interface INotification {
  message: string;
  user: string;
  seen: boolean;
  notificationId: string;
}

export default async function setSeenNotification(notification: INotification) {
  console.log(JSON.stringify(notification));
  const res = await fetch(
    `${process.env.BACKEND_URL}/notifire/${notification.notificationId}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cache: "no-store",
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