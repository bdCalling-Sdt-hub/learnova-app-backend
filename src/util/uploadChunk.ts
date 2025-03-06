import axios, { AxiosProgressEvent } from "axios";

// Define the type for the onProgress callback
type OnProgressCallback = (progress: number) => void;

export const uploadVideoChunks = async (
    file: File,
    onProgress: OnProgressCallback
): Promise<string | void> => {
    const chunkSize = 5 * 1024 * 1024; // 5 MB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedBytes = 0; // Track the uploaded bytes across chunks

    for (let index = 0; index < totalChunks; index++) {
        const start = index * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("originalname", file.name);
        formData.append("chunkIndex", index.toString());
        formData.append("totalChunks", totalChunks.toString());

        try {
            // Define the expected response type
            const response = await axios.post<{ videoUrl?: string }>(
                `http://143.198.3.51:8000/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
            // Update the total uploaded bytes after each chunk completes
            uploadedBytes += chunk.size;

            // Calculate the overall progress percentage
            const totalProgress = Math.min(
                100,
                Math.round((uploadedBytes / file.size) * 100)
            );
            onProgress(totalProgress); // Update the progress state

            // If this is the last chunk, return the video URL
            if (index === totalChunks - 1 && response.data?.videoUrl) {
                return response.data.videoUrl;
            }
        } catch (error) {
            console.error("Error uploading chunk:", error);
            throw error;
        }
    }
};
