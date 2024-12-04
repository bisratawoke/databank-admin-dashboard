import { Button } from "antd";
import React from "react";
import { GoPeople } from "react-icons/go";
export default function ShareIcon() {
  return (
    <Button
      style={{
        backgroundColor: "white",
        borderColor: "#166EE1",
        borderRadius: "24px",
      }}
      icon={<GoPeople size={16} color="#166EE1" />}
    >
      <span
        style={{
          fontSize: "13px",
          color: "#166EE1",
          fontWeight: 400,
          lineHeight: "18px",
        }}
      >
        Share
      </span>
    </Button>
  );
}
