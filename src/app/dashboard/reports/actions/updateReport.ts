/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/auth";
const API_URL = process.env.BACKEND_URL;

export async function updateReport({
  reportId,
  data,
}: {
  reportId: string | undefined;
  data: any[];
}) {
  const session: any = await getSession();

  console.log(reportId);
  console.log(data);
  if (!reportId || !data?.length) {
    throw new Error("Invalid reportId or dataIds");
  }

  try {
    const res = await fetch(`${API_URL}/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({
        data,
      }),
      cache: "no-store",
    });

    console.log(data);
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(
        errorData.message || `Failed to update report: ${res.status}`
      );
    }

    const responseData = await res.json();
    console.log(responseData);
    revalidatePath("/dashboard/reports");
    return responseData;
  } catch (error: any) {
    console.error("Error in updateReport:", error);
    throw error;
  }
}
