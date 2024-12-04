/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/auth";
interface DataEntry {
  field: string;
  value: string;
}

interface CreateDataResponse {
  result?: any[];
  error?: string;
  status: number;
}

export async function createData(
  reportId: string,
  dataEntries: DataEntry[]
): Promise<CreateDataResponse> {
  console.log("dataEntries: ", dataEntries);
  const API_URL = process.env.BACKEND_URL;
  const session: any = await getSession();
  try {
    const res = await fetch(`${API_URL}/data/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ reportId, dataEntries }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to create data: ${res.status} ${res.statusText}`);
    }

    // Revalidate the reports page
    revalidatePath("/dashboard/reports");

    return {
      result,
      status: res.status,
    };
  } catch (error: any) {
    console.error("Error in createData:", error);
    return {
      error: error.message,
      status: error.status || 500,
    };
  }
}
