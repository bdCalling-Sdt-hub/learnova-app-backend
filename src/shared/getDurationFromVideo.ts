import { getVideoDurationInSeconds } from 'get-video-duration';
import fetch from 'node-fetch';
import { Readable } from 'stream';

const getDuration = async (url: string): Promise<number> => {
    const response = await fetch(url);

    console.log(response);
    if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const nodeReadableStream = Readable.from(Buffer.from(buffer));

    const duration = await getVideoDurationInSeconds(nodeReadableStream);
    console.log(duration);
    return duration;
};

export default getDuration;