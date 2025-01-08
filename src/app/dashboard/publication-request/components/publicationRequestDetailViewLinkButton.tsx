import { useRouter } from "next/navigation";
export default function PublicationRequestDetailViewLinkButton({
  recordId,
}: {
  recordId: string;
}) {
  const router = useRouter();
  return (
    <button
      className="bg-[#1E50A0] w-[113px] h-[29px] rounded-md"
      onClick={() => {
        router.push(`/dashboard/publication-request/${recordId}`);
      }}
    >
      <span className="text-white text-[22px]/12px">View Detail</span>
    </button>
  );
}
