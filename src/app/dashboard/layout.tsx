"use client";
import React from "react";
import { Layout } from "antd"; // Ant Design Layout
import Sidebar from "../(components)/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { Content } = Layout; // Destructure Content from Layout

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <Layout className="site-layout">
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="p-4 min-h-screen"
            style={{ padding: 24, background: "#fff", minHeight: 360 }}
          >
            <h1 className="text-xl font-bold mb-4">Dashboard</h1>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
