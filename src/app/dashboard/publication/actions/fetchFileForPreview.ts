"use server";

export async function FetchFileForPreview() {
  const res = await fetch(
    `${process.env.BACKEND_URL}/publications/download/pw_cash_transfer_v6.csv`,
    {
      headers: {
        "cache-control": "no-cache",
      },
    }
  );

  // const result = await
}
