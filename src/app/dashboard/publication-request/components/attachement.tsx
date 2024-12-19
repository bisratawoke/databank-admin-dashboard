import Image from "next/image";
export default function Attachment({ link }: { link: string }) {
  const fileName = link.split("/")[link.split("/").length - 1];

  return (
    <div className="flex justify-between py-2">
      <div className="flex items-center gap-2">
        <Image src="/pdfIcon.svg" width={26} height={28} alt="" />
        <span className="text-[14px] text-[#324054]">{fileName}</span>
      </div>
      <div className="flex items-center">
        <Image
          src="/downloadIcon.svg"
          width={16}
          height={18}
          alt="download image"
          onClick={() => {
            window.open(`http://${link}`);
          }}
        />
      </div>
    </div>
  );
}
