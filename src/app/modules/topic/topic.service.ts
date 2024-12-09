import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ITopic } from "./topic.interface";
import { Topic } from "./topic.model";

const createTopicToDB = async (payload: ITopic): Promise<ITopic> =>{
    const topic = await Topic.create(payload);
    if(!topic){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To created Topic")
    }
    return topic;
}

export const TopicService = {
    createTopicToDB
}