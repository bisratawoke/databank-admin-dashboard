/* eslint-disable @typescript-eslint/no-explicit-any */
import { publication } from "../../types";
import { VscChromeClose } from "react-icons/vsc";
const DetailPair = ({ header, value }: { header: string; value: any }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <span
      style={{
        font: "Roboto",
        fontSize: "16px",
        lineHeight: "24px",
        fontWeight: 500,
      }}
    >
      {header}
    </span>
    <span
      style={{
        font: "Roboto",
        fontSize: "14px",
        lineHeight: "24px",
        fontWeight: 300,
      }}
    >
      {value}
    </span>
  </div>
);

export default function Details({
  detail,
  close,
}: {
  detail: publication | null;
  close: any;
}) {
  return (
    <div
      style={{
        width: "20vw",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "#FAFAFA",
        position: "relative",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            font: "Roboto",
            fontSize: "24px",
            lineHeight: "24px",
            fontWeight: 500,
          }}
        >
          {detail?.name.split(".")[0]}
        </span>
        <VscChromeClose onClick={() => close()} style={{ cursor: "pointer" }} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <span
          style={{
            font: "Roboto",
            fontSize: "20px",
            lineHeight: "24px",
            fontWeight: 500,
          }}
        >
          File Details
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <DetailPair header={"Type"} value={detail?.name.split(".")[1]} />
          <DetailPair header={"Size"} value={detail?.size} />
          <DetailPair header={"Storage Used"} value={detail?.size} />
          <DetailPair header={"Location"} value={"PLACEHOLDER"} />
          <DetailPair header={"Owner"} value={"PLACEHOLDER"} />
          <DetailPair
            header={"Modified"}
            value={
              detail?.lastModified
                ? new Date(detail?.lastModified).toString()
                : ""
            }
          />
          <DetailPair header={"Opened"} value={"PLACEHOLDER"} />
          <DetailPair header={"Created"} value={"PLACEHOLDER"} />
          <DetailPair header={"Accessibility"} value={"Public"} />
          <DetailPair header={"Description"} value={"PLACEHOLDER"} />
        </div>
      </div>
    </div>
  );
}
