"use client";

import React from "react";
import { MdOutlineAddBox } from "react-icons/md";
export default function AddButton({
  action,
}: {
  action: React.MouseEventHandler<SVGElement>;
}) {
  return (
    <MdOutlineAddBox
      onClick={action}
      style={{
        cursor: "pointer",
      }}
    />
  );
}
