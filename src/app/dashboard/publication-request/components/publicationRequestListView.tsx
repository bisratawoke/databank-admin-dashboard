"use client";
import { Table } from "antd";
export default function PublicationRequestListView({
  publicationRequestList,
}: {
  publicationRequestList: Array<Record<string, any>>;
}) {
  const columns = [
    { title: "Request Id", dataIndex: "_id", key: "_id" },
    {
      title: "Request Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Purpose for Research",
      dataIndex: "purposeForResearch",
      key: "purposeForResearch",
    },
  ];
  return (
    <Table
      dataSource={publicationRequestList}
      columns={columns}
      size="small"
      bordered
      onRow={(row) => {
        return {};
      }}
    />
  );
}
