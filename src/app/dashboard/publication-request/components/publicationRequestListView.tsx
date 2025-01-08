"use client";
import { Table } from "antd";
import PublicationStatusTag from "./publicationStatusTag";
import { useRouter } from "next/navigation";
import PublicationRequestPaymentStatusColumnValue from "./publicationRequestPaymentStatusColumnValue";
import PublicationRequestDetailViewLinkButton from "./publicationRequestDetailViewLinkButton";
export default function PublicationRequestListView({
  publicationRequestList,
}: {
  publicationRequestList: Array<Record<string, any>>;
}) {
  const router = useRouter();
  const columns = [
    {
      title: "Administration Units",
      dataIndex: "adminUnits",
      key: "adminUnits",
    },
    {
      title: "Date",
      dataIndex: "",
      key: "Date",
      render: (_, record: Record<string, any>) => {
        const date = new Date(record.createdAt);
        const parsedDate = date.toUTCString().split(" ").slice(0, 4).join(" ");
        return <span>{parsedDate}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        return <PublicationStatusTag value={value} />;
      },
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record: Record<string, any>) => (
        <PublicationRequestPaymentStatusColumnValue record={record} />
      ),
    },
    {
      title: "Attachements",
      dataIndex: "attachments",
      key: "attachments",
      render: (value: Array<string>) => {
        return (
          <>
            {value.map((file, index) => (
              <a key={index} download href={`http://${file}`}>
                Download Attachement
              </a>
            ))}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      render(_, record: Record<string, any>) {
        return <PublicationRequestDetailViewLinkButton recordId={record._id} />;
      },
    },
  ];
  return (
    <div className="grid grid-cols-12">
      <div className="col-start-2 col-end-12">
        <Table
          dataSource={publicationRequestList}
          columns={columns}
          size="small"
          bordered
        />
      </div>
    </div>
  );
}
