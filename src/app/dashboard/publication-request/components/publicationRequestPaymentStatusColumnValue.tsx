import { Tag } from "antd";

export default function PublicationRequestPaymentStatusColumnValue({
  record,
}: {
  record: Record<string, any>;
}) {
  let paymentStatus = null;

  if (!record.paymentRequired) {
    paymentStatus = "Free";
  } else {
    if (record.paymentData) {
      if (record.paymentData.paymentStatus == "Pending") {
        paymentStatus = "Not Paid";
      } else {
        paymentStatus = "Paid";
      }
    }
  }
  return (
    <Tag color={paymentStatus == "Free" ? "blue" : ""}>{paymentStatus}</Tag>
  );
}
