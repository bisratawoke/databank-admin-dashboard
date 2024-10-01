"use server";

import { Data } from "../types";

const API_URL = process.env.BACKEND_URL;
export const updateReport = async (
  reportId: string,
  data: Data[]
): Promise<{ result: any; status: number }> => {
  const response = await fetch(`${API_URL}/reports/${reportId}`, {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ data }),
    method: "PUT",
  });
  const result = await response.json();

  return {
    result,
    status: response.status,
  };
};
