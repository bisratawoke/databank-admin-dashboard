"use client";
import React from "react";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

export default function SecondaryNav() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <div
      style={{
        backgroundColor: "#1463CA",
        padding: "16px",
        paddingLeft: "20px",
        // padding: "20px",
      }}
    >
      <Breadcrumb style={{ color: "#fff" }}>
        {pathnames.map((value, index) => {
          const url = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <Breadcrumb.Item key={url}>
              <a href={url} style={{ color: "#fff" }}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </a>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
}