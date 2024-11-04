"use client";
import { Flex, Layout } from "antd";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import User from "./component/User";
import Logo from "../(components)/Logo";
import NavItem from "../(components)/NavItem";
import NotificationIcon from "../(components)/NotificationIcon";
import HelpIcon from "../(components)/HelpIcon";
import ShareIcon from "../(components)/ShareIcon";
import SecondaryNav from "../(components)/SecondaryNav";
import { fetchNotification } from "./actions/fetchNotification";
import { Badge } from "antd";
import Notifications from "../(components)/Notifications";
const { Content } = Layout;

export default function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { body } = await fetchNotification(); // Call the fetchNotification server action
        console.log("=========== in load notifications =================");
        console.log(body);
        setNotifications(body); // Update state with the fetched notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    loadNotifications(); // Call the function to load notifications
  }, []); // Empty dependency array ensures this runs once on mount

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
              <NavItem
                label="Publication"
                link="/dashboard/publication/list-view"
              />
            </div>
          </div>
          <Flex gap={16} align="center" style={{ height: "100%" }}>
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
            <Notifications notifications={notifications} />
            {/* <Badge count={notifications.length}>
              <NotificationIcon />{" "}
            </Badge> */}
            {/* Pass notifications to NotificationIcon */}
            <User />
          </Flex>
        </div>
        <SecondaryNav />
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
}
