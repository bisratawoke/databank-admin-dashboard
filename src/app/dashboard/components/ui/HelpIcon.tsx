import React from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { Button } from "antd";
export default function HelpIcon() {
  return (
    <Button
      style={{
        backgroundColor: "#166EE1",
        borderColor: "#166EE1",
      }}
      icon={<CiCircleQuestion size={24} color="white" />}
    >
      <span
        style={{
          fontSize: "13px",
          color: "white",
          fontWeight: 400,
          lineHeight: "18px",
        }}
      >
        Help
      </span>
    </Button>
  );
}
