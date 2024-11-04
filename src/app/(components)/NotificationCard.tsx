/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from "antd";
import setSeenNotification from "../dashboard/actions/setSeenNotification";
interface NotificationCardProps {
  message: string;
  user: string;
  createdAt: string;
  notificationId: string;
  removeNotification: any;
}

export default function NotificationCard({
  message,
  user,
  createdAt,
  notificationId,
  removeNotification,
}: NotificationCardProps) {
  return (
    <div className="flex gap-5 items-center p-5 mb-2 bg-white rounded border-2">
      <Avatar className="mr-3">Osh</Avatar>
      <div className="flex-1">
        {/* <strong className="block">{user}</strong> */}
        <div className="flex justify-between">
          <p className="text-sm">{message}</p>
          <button
            onClick={async () => {
              const { body, status } = await setSeenNotification({
                message: message,
                user: user,
                seen: true,
                notificationId: notificationId,
              });
              alert(status);
              if (status == 200) {
                removeNotification(notificationId);
              }
            }}
          >
            <span className="text-sky-500"> Mark As Read</span>
          </button>
        </div>
        <small className="text-gray-500">
          {new Date(createdAt).toString()}
        </small>
      </div>
    </div>
  );
}
