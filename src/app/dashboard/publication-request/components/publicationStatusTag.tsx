"use client";

import { Tag } from "antd";

export default function PublicationStatusTag({ value }: { value: string }) {
  switch (value) {
    case "Deputy Approved":
      return <Tag color="green">{value}</Tag>;
    default:
      return <Tag color="orange">{value}</Tag>;
  }
}
