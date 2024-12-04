/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Data } from "../types";
import { getSession } from "@/lib/auth/auth";
const API_URL = process.env.BACKEND_URL;
export const updateData = async ({
  data,
}: {
  data: Data[];
}): Promise<{ result?: any; status: number; error?: any }> => {
  console.log("data being sent: ", data);
  const session: any = await getSession();
  try {
    const response = await fetch(`${API_URL}/data/bulkUpdate`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ data }),
      method: "PUT",
    });

    const result = await response.json();

    return {
      result,
      status: response.status,
    };
  } catch (error) {
    console.error("Error updating report:", error);
    return {
      error,
      status: 500,
    };
  }
};
