"use client";
import { Spin } from "antd";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <Spin />;
    </div>
  );
}
