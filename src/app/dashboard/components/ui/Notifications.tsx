/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge, Popover } from "antd";
import NotificationCard from "@/app/dashboard/components/ui/NotificationCard";
import NotificationIcon from "@/app/dashboard/components/ui/NotificationIcon";
import { useEffect, useState } from "react";

export interface Notification {
  message: string;
  user: string;
  createdAt: string;
  seen: string;
  _id: string;
}

export default function Notifications({
  notifications = [],
}: {
  notifications: Notification[];
}) {
  const [filteredNotificationList, setFilteredNotificationList] = useState<any>(
    []
  );

  useEffect(() => {
    setFilteredNotificationList(notifications.filter((item) => !item.seen));
  }, [notifications]);

  const removeNotification = (notificationId: string) => {
    setFilteredNotificationList((prevList: Array<Record<string, any>>) =>
      prevList.filter((item: Record<string, any>) => item._id != notificationId)
    );
  };

  const notificationContent = (
    <div className="max-h-80 overflow-y-auto p-2">
      {filteredNotificationList.length < 1 && (
        <div className="flex gap-5 items-center p-5 mb-2 bg-white justify-center">
          <span className="text-sky-500">No new Notifications</span>
        </div>
      )}
      {filteredNotificationList.map(
        (notification: Record<string, any>, index: number) => (
          <NotificationCard
            key={index}
            message={notification.message}
            user={notification.user}
            createdAt={notification.createdAt}
            notificationId={notification._id}
            removeNotification={removeNotification}
          />
        )
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title=""
      trigger="click"
      placement="bottomRight"
    >
      <Badge count={filteredNotificationList.length}>
        <NotificationIcon />
      </Badge>
    </Popover>
  );
}
