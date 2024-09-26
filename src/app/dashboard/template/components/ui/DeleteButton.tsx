"use client";

import React from "react";
import { LuDelete } from "react-icons/lu";
export default function DeleteButton({
  action,
}: {
  action: React.MouseEventHandler<SVGElement>;
}) {
  return (
    <LuDelete
      size={16}
      onClick={action}
      style={{
        cursor: "pointer",
      }}
    />
  );
}
