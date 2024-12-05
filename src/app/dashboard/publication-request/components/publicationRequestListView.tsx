"use client";
import { Table } from "antd";
import PublicationStatusTag from "./publicationStatusTag";
import { useRouter } from "next/navigation";
export default function PublicationRequestListView({
  publicationRequestList,
}: {
  publicationRequestList: Array<Record<string, any>>;
}) {
  const router = useRouter();
  const columns = [
    { title: "Request Id", dataIndex: "_id", key: "_id" },
    {
      title: "Request Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        return <PublicationStatusTag value={value} />;
      },
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
      onRow={(record) => {
        return {
          onClick: () => {
            router.push(`/dashboard/publication-request/${record._id}`);
          },
          onMouseEnter: () => {},
        };
      }}
    />
  );
}
