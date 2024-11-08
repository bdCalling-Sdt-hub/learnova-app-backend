import mongoose from "mongoose";
import { ILike } from "./like.interface";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Like } from "./like.model";
import { JwtPayload } from "jsonwebtoken";

const toggleLikeToDB = async (payload: Partial<ILike>): Promise<string> => {

    if (!mongoose.Types.ObjectId.isValid(payload.student)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Student ID");
    }

    if (!mongoose.Types.ObjectId.isValid(payload.course)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Course ID");
    }

    const isExist = await Like.findOne({
        student: payload.student,
        course: payload.course,
        teacher: payload.teacher
    })

    if (isExist) {
        await Like.findByIdAndDelete(isExist._id);
        return "UnLike This Course"
    } else {
        const result = await Like.create(payload);

        if (!result) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Like")
        }

        return "Like This Course"
    }
}


const likeCountFromDB = async (user: JwtPayload, course: string): Promise<ILike | {}> => {

    const result = await Like.countDocuments({ 
        teacher: user.id,
        course:  course
    })

    return result;
}

export const LikeService = {
    toggleLikeToDB,
    likeCountFromDB
}