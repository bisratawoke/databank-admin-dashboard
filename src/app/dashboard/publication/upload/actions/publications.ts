'use server'

import { revalidatePath } from 'next/cache'

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
    console.log("uploadPublication", formData)
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/publications/upload`, {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.log("uploadFaild", errorData)
            throw new Error(errorData.message || 'Failed to upload file')
        }

        const result = await response.json()
        revalidatePath('/publications')

        return {
            success: true,
            data: result
        }
    } catch (error) {
        console.error('Error uploading file:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload file'
        }
    }
}

export async function updatePublication(id: string, updateData: Partial<PublicationData>) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/publications/metadata/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error('Failed to update publication');
        }

        const result = await response.json();
        revalidatePath('/publications');
        return { success: true, publication: result.metadata };
    } catch (error) {
        console.error('Update publication error:', error);
        return { success: false, error: 'Failed to update publication' };
    }
}

export async function fetchPublications(): Promise<PublicationData[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/publications`, {
            next: { revalidate: 0 } // This ensures we always get fresh data
        });

        if (!response.ok) {
            throw new Error('Failed to fetch publications');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch publications error:', error);
        throw error;
    }
}
export async function fetchBuckets(): Promise<string[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/publications/buckets/list`, {
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch buckets');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch buckets error:', error);
        throw error;
    }
}

export async function fetchLocations(): Promise<string[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/publications/buckets/locations`, {
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch locations error:', error);
        throw error;
    }
}

export async function deletePublication(id: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/publications/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete publication');
        }

        revalidatePath('/publications');
        return await response.json();
    } catch (error) {
        console.error('Delete publication error:', error);
        throw error;
    }
}



