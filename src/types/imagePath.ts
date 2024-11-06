export type FileWithMedia = {
    image?: { filename: string }[] | null;
    video?: { filename: string } | null;
};