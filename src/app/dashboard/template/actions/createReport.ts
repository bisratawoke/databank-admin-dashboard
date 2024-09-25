"use server";
import { report } from "../types";

export async function createReport(report: report) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/reports`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(report),
    });
    const result = await res.json();
    return {
      body: result,
      status: res.status,
    };
  } catch (err) {
    console.log("============ in create report error =======");
    console.log(err);

    // Return a mocked Response-like object to avoid TypeScript errors
    return {
      status: 500,
    };
  }
}
