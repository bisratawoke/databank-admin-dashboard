"use client";
export default function Error({
  error,
}: {
  error: Error & { digest: string };
}) {
  return (
    <div>
      caught
      {error.message}
      in nester
    </div>
  );
}
