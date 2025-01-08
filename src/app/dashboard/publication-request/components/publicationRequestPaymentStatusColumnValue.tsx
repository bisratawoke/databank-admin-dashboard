import { Tag } from "antd";

export default function PublicationRequestPaymentStatusColumnValue({
  record,
}: {
  record: Record<string, any>;
}) {
  let paymentStatus = null;

  if (!record.paymentRequired) {
    paymentStatus = "Free";
  }

  return (
    <Tag color={paymentStatus == "Free" ? "blue" : ""}>{paymentStatus}</Tag>
  );
}
