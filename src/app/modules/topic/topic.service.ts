import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ITopic } from "./topic.interface";
import { Topic } from "./topic.model";
import mongoose from "mongoose";

const createTopicToDB = async (payload: ITopic): Promise<ITopic> =>{
    const topic = await Topic.create(payload);
    if(!topic){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To created Topic")
    }
    return topic;
};

const deleteTopicToDB = async (id: string): Promise<ITopic | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    
    const result = await Topic.findByIdAndDelete(id);
    if(!result){
        throw new ApiError(StatusCodes.CONFLICT, "Failed to Deleted Topic");
    }
    return result;
};

const updateTopicToDB = async (id: string, payload: ITopic): Promise<ITopic | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    
    const result = await Topic.findByIdAndUpdate(
        {_id: id},
        payload,
        {new: true}
    );
    if(!result){
        throw new ApiError(StatusCodes.CONFLICT, "Failed to Deleted Topic");
    }
    return result;
}; 

export const TopicService = {
    createTopicToDB,
    updateTopicToDB,
    deleteTopicToDB
}