import React from "react";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation"; // Use this for Next.js App Router

export default function SecondaryNav() {
  const pathname = usePathname(); // Get the current route
  const pathnames = pathname.split("/").filter((x) => x); // Split and filter the path

  return (
    <div
      style={{
        backgroundColor: "#1463CA",
        padding: "16px",
        paddingLeft: "20px",
        // padding: "20px",
      }}
    >
      {/* Ant Design Breadcrumb */}
      <Breadcrumb style={{ color: "#fff" }}>
        {/* Home link */}

        {/* Dynamically generated breadcrumb items */}
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
