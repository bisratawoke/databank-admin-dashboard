"use client";
import { Flex, Layout } from "antd";
import styles from "./dashboard.module.css";
import User from "./component/User";
import Logo from "../(components)/Logo";
import NavItem from "../(components)/NavItem";
import NotificationIcon from "../(components)/NotificationIcon";
import HelpIcon from "../(components)/HelpIcon";
import ShareIcon from "../(components)/ShareIcon";
import SecondaryNav from "../(components)/SecondaryNav";
const { Content } = Layout;

export default function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout className={styles.outerLayout} hasSider>
      {/* <Sider
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
      </Sider> */}
      <Layout
        style={{
          backgroundColor: "red",
        }}
      >
        <div
          // className={styles.header}
          style={{
            backgroundColor: "#166EE1",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "50px",
            padding: "20px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Logo />
            <span
              style={{
                font: "Roboto",
                fontSize: "17px",
                lineHeight: "24px",
                color: "white",
                fontWeight: 675,
              }}
            >
              Ess Stat Bank
            </span>

            <div>
              <NavItem label="Organization" link="/dashboard/organization" />
              <NavItem label="Data Types" link="/dashboard/field-type" />
              <NavItem
                label="Report Designer"
                link="/dashboard/template/reports"
              />
              <NavItem label="Import tool" link="/dashboard/reports" />
            </div>
          </div>
          <Flex
            gap={16}
            // justify="end"
            align="center"
            style={{ height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <HelpIcon />
              <ShareIcon />
            </div>
            <NotificationIcon />
            <User />
          </Flex>
        </div>
        <SecondaryNav />
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
}
