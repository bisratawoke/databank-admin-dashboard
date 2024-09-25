"use client";
import { Flex, Layout, Menu } from "antd";
import Link from "next/link";

const MenuItems = [
  {
    key: "1",
    path: "/dashboard",
    // icon: <DashboardOutlined />,
    label: <Link href={"/dashboard/report"}>reports</Link>,
  },
];
export default function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { Content } = Layout;
  return (
    <Layout hasSider>
      {/* <Sider theme="dark" collapsible defaultCollapsed>
        <Flex justify="center">
          <span> Logo</span>
        </Flex>
        <Menu theme="dark" mode="inline" items={MenuItems} />
      </Sider> */}
      <Content>{children}</Content>
    </Layout>
  );
}
