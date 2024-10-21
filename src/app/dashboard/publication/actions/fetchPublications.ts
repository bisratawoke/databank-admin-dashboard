"use server";

export async function FetchPublications({ path = "" }: { path?: string }) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/publications?path=${path}`,
      {
        headers: {
          "cache-control": "no-cache",
        },
        cache: "no-cache",
      }
    );

    const result = await res.json();

    console.log("========== in here ================");
    console.log(result);
    console.log(res.status);
    return {
      body: result,
      status: res.status,
    };
  } catch (err) {
    console.log(err);
    return {
      body: [],
      status: 400,
    };
  }
}
