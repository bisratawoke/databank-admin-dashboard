import React from "react";

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  return <div>{children}</div>;
}
