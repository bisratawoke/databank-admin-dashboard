import React from "react";

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold mb-4">Uploads</h1>
        {children}
      </div>
    </div>
  );
}
