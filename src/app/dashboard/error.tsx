"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <h2 className="text-[24px] font-bold text-red-500">{error.message}</h2>
    </div>
  );
}
