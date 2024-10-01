"use client";

import React from "react";
import { MdDelete } from "react-icons/md";

export default function DeleteButton({
  action,
}: {
  action: React.MouseEventHandler<SVGElement>;
}) {
  return (
    <MdDelete
      size={16}
      onClick={action}
      style={{
        cursor: "pointer",
      }}
    />
  );
}
