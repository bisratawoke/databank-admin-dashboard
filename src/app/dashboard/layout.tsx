"use client";
import { Flex, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import styles from "./dashboard.module.css";
import Logo from "./public/logo.jpg";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import User from "./component/User";
const { Header, Content, Footer } = Layout;

const items = [
  {
    key: "1",
    path: "/dashboard",
    icon: <MdDashboard />,
    label: <Link href={"/dashboard/template/reports"}>Models</Link>,
  },
];

export default function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout className={styles.outerLayout} hasSider>
      <Sider
        theme="light"
        collapsible
        defaultCollapsed
        className={styles.sider}
      >
        <Flex justify="center">
          <Link href={"/"}>
            <Image src={Logo} alt="Logo" height={50} width={50} />
          </Link>
        </Flex>
        <Menu
          className={styles.menu}
          theme="light"
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className={styles.innerLayout}>
        <Header
          className={styles.header}
          style={{
            backgroundColor: "white",
          }}
        >
          <Flex justify="end" align="center" style={{ height: "100%" }}>
            <User />
          </Flex>
        </Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer} style={{ backgroundColor: "white" }}>
          <span>
            &copy; {new Date().getFullYear()}. All rights reserved. Powered by{" "}
            <a
              className={styles.link}
              href="https://360ground.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              360Ground
            </a>
            .
          </span>
        </Footer>
      </Layout>
    </Layout>
  );
}

