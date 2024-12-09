import mongoose from "mongoose";
import { IProgress } from "./progress.interface";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Progress } from "./progress.model";

const createProgressToDB = async (payload: IProgress): Promise<IProgress>=>{
    const { topic, lesson } = payload;

    if(!mongoose.Types.ObjectId.isValid(topic)) throw new ApiError(StatusCodes.CONFLICT, "Invalid Topic ID");
    if(!mongoose.Types.ObjectId.isValid(lesson)) throw new ApiError(StatusCodes.CONFLICT, "Lesson Topic ID");

    const progress = await Progress.create(payload);
    if(!progress) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Progress");
    }

    return progress;
}

export const ProgressService = {
    createProgressToDB
}