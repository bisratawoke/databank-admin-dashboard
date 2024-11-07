/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getSession } from "./auth";

export enum ACTION {
  HIDE,
  THROW,
}
export default async function WithRole({
  children,
  role,
  action = ACTION.THROW,
}: {
  children: React.ReactNode;
  role: string;
  action?: ACTION;
}) {
  const session: any = await getSession();

  if (!session?.user?.roles.includes(role)) {
    if (action == ACTION.THROW) {
      throw new Error("You are not allowed to see this page");
    }
    return <React.Fragment></React.Fragment>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
