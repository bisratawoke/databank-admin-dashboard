"use client";
import React, { useState } from "react";
import { Layout, Breadcrumb } from "antd";
import {
  FileDoneOutlined,
  FileAddOutlined,
  ProfileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the menu items
const menuItems = [
  {
    key: "1",
    href: "/dashboard/report",
    icon: <FileDoneOutlined />,
    label: "Reports",
  },
  {
    key: "2",
    href: "/dashboard/fields",
    icon: <FileAddOutlined />,
    label: "Fields",
  },
  {
    key: "3",
    href: "/dashboard/field-types",
    icon: <ProfileOutlined />,
    label: "Field Types",
  },
  {
    key: "4",
    href: "/dashboard/reports",
    icon: <UploadOutlined />,
    label: "Uploads",
  },
];

const SidebarLink = ({ href, icon, label, isCollapsed }: any) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-gray-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
      >
        {icon}
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Layout.Sider
      width={240}
      collapsedWidth={isSidebarCollapsed ? 50 : 80} // Set collapsedWidth here
      collapsible
      collapsed={isSidebarCollapsed}
      onCollapse={toggleSidebar}
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex flex-col h-full">
        {/* When the sidebar is collapsed, show breadcrumb */}
        {isSidebarCollapsed ? (
          <div className="breadcrumb-container p-4">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/dashboard">Dashboard</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="logo px-8 pt-8">
              <div>Logo</div>
              <h1 className="text-2xl font-extrabold">ESS</h1>
            </div>

            {/* Links */}
            <div className="flex-grow mt-8">
              {menuItems.map(({ key, href, icon, label }) => (
                <SidebarLink
                  key={key}
                  href={href}
                  icon={icon}
                  label={label}
                  isCollapsed={isSidebarCollapsed}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="mb-10 text-center text-xs text-gray-500">
              &copy; 2024 ESS
            </div>
          </div>
        )}
      </div>
    </Layout.Sider>
  );
};

export default Sidebar;
