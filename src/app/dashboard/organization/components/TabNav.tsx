"use client";

import React, { useEffect } from "react";
import { Tabs } from "antd";
import { useRouter, usePathname } from "next/navigation";

const { TabPane } = Tabs;

interface TabItem {
  key: string;
  tab: string;
}

const TabNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { key: "/dashboard/organization", tab: "organization" },
    { key: "/dashboard/organization/department", tab: "department" },
    { key: "/dashboard/organization/category", tab: "category" },
    { key: "/dashboard/organization/sub-category", tab: "sub-category" },
  ];

  const activeKey = tabs.find((tab) => pathname === tab.key) ? pathname : "/";

  const onTabChange = (key: string) => {
    router.push(key);
  };

  useEffect(() => {
    const currentTab = tabs.find((tab) => pathname === tab.key);
    if (!currentTab) {
      router.replace("/dashboard/organization");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Tabs activeKey={activeKey} onChange={onTabChange}>
      {tabs.map((tab) => (
        <TabPane tab={tab.tab} key={tab.key} />
      ))}
    </Tabs>
  );
};

export default TabNav;