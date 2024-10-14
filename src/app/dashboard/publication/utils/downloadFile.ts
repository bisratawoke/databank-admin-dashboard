export const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    // Fetch the file from the remote server
    const response = await fetch(fileUrl);

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    // Convert the response into a Blob
    const blob = await response.blob();

    // Create a link element
    const link = document.createElement("a");

    // Create an object URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Set the link's href to the object URL and download attribute to the file name
    link.href = url;
    link.download = fileName;

    // Append the link to the document (it won't be visible)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link after the download is triggered
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
  }
};
