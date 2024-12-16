"use client";
export default function Error({
  error,
}: {
  error: Error & { digest: string };
}) {
  console.log(error);
  return (
    <div>
      caught
      {error.message}
      in nester
    </div>
  );
}
