/* eslint-disable @typescript-eslint/no-explicit-any */
import { publication } from "../../types";
import { VscChromeClose } from "react-icons/vsc";
import PublicationStatusManager from "./PublicationStatusManager";
import fetchChat from "@/app/dashboard/actions/fetchChat";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import ChatContainer from "@/app/dashboard/components/ui/ChatContainer";

const DetailPair = ({ header, value }: { header: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-[16px]/[24px] font-[500]">{header}</span>
    <span className="text-[14px]/[24px] font-[3000]">{value}</span>
  </div>
);

export default function Details({
  detail,
  close,
}: {
  detail: publication | null;
  close: any;
}) {
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const pub = JSON.parse(JSON.stringify(detail));
  useEffect(() => {
    fetchChat({ subjectId: pub._id }).then((res) => {
      setChatInfo(res.body);
      setLoading(false);
    });
  }, []);
  console.log("=========== in details ======");
  console.log(pub);
  if (loading) {
    return <Spinner />;
  } else
    return (
      <div className="w-[20vw] flex flex-col gap-[24px] bg-[#FAFAFA] p-[15px] rounded-[5px]">
        <div className="flex justify-between items-center">
          <span className="text-[24px]/[24px] font-[500]">{pub.name}</span>
          <VscChromeClose
            onClick={() => close()}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="flex flex-col gap-[20px]">
          <span className="text-[20px]/[24px] font-[500]">File Details</span>

          <div className="flex flex-col gap-[16px]">
            <DetailPair header={"Type"} value={pub.metadata.type} />
            <DetailPair header={"Size"} value={pub.metadata.size} />
            <DetailPair header={"Location"} value={pub.metadata.location} />
            <DetailPair header={"Modified"} value={pub.metadata.updatedAt} />
            <DetailPair header={"Created"} value={pub.metadata.createdAt} />
            <DetailPair header={"Accessibility"} value={"Public"} />
            <DetailPair
              header={"Description"}
              value={pub.metadata.description}
            />
            <PublicationStatusManager publication={pub} />
          </div>
          <ChatContainer {...chatInfo} />
        </div>
      </div>
    );
}
