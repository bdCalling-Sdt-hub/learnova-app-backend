import { FileWithMedia } from "../types/imagePath";

export const createMediaPath = async (file: FileWithMedia) =>{

    // Check if the file has an image and it is not empty
    if (file.image && file.image.length > 0) {
        return `/images/${file.image[0].filename}`;
    }
    
    // Check if the file has a video and it is not empty
    if (file.video && file.video) {
        return `/videos/${file.video?.filename}`;
    }

    return null
}