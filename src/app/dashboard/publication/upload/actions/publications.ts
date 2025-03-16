"use server";

import { getSession } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

interface PublicationData {
  _id: string;
  fileName: string;
  description: string;
  keyword: string[];
  type: string;
  location: string;
  modified_date: string;
  created_date: string;
  bucketName: string;
}

export async function uploadPublication(formData: FormData) {
  try {
    const session: any = await getSession();
    const response = await fetch(
      `${process.env.BACKEND_URL}/publications/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload file");
    }

    const result = await response.json();
    revalidatePath("/publications");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

export async function updatePublication(
  id: string,
  updateData: Partial<PublicationData>
) {
  try {
    const session: any = await getSession();
    const response = await fetch(
      `${process.env.BACKEND_URL}/publications/metadata/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update publication");
    }

    const result = await response.json();
    revalidatePath("/publications");
    return { success: true, publication: result.metadata };
  } catch (error) {
    console.error("Update publication error:", error);
    return { success: false, error: "Failed to update publication" };
  }
}

export async function fetchPublications(): Promise<PublicationData[]> {
  try {
    const session: any = await getSession();
    const response = await fetch(`${process.env.BACKEND_URL}/publications`, {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch publications");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch publications error:", error);
    throw error;
  }
}

export async function fetchBuckets(): Promise<string[]> {
  try {
    const session: any = await getSession();
    const response = await fetch(
      `${process.env.BACKEND_URL}/publications/buckets/list`,
      {
        headers: {
          authorization: `Bearer ${session.user.accessToken}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch buckets");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch buckets error:", error);
    throw error;
  }
}

export async function fetchLocations(): Promise<string[]> {
  try {
    const session: any = await getSession();
    const response = await fetch(
      `${process.env.BACKEND_URL}/publications/buckets/locations`,
      {
        headers: {
          authorization: `Bearer ${session.user.accessToken}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch locations error:", error);
    throw error;
  }
}

export async function deletePublication(id: string) {
  try {
    const session: any = await getSession();
    const response = await fetch(
      `${process.env.BACKEND_URL}/publications/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    console.log(response.status);

    if (!response.ok) {
      throw new Error("Failed to delete publication");
    }

    revalidatePath("/publications");
    return await response.json();
  } catch (error) {
    console.error("Delete publication error:", error);
    throw error;
  }
}
