import mongoose, { Types } from "mongoose";
import { ILike } from "./like.interface";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Like } from "./like.model";
import { JwtPayload } from "jsonwebtoken";


const toggleLikeToDB = async (payload: ILike): Promise<string> => {

    // Validate `course` if present
    if (payload.course && !mongoose.Types.ObjectId.isValid(payload.course)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Course ID");
    }

    // Validate `short` if present
    if (payload.short && !mongoose.Types.ObjectId.isValid(payload.short)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Short ID");
    }

    // Construct the query object dynamically based on available fields
    const query: Record<string, Types.ObjectId> = { student: payload.student };
    if (payload.course) query.course = payload.course;
    if (payload.short) query.short = payload.short;

    // Check if a like already exists
    const isExist = await Like.findOne(query);

    if (isExist) {
        await Like.findByIdAndDelete(isExist._id);
        return "UnLiked Successfully";
    } else {
        const result = await Like.create(payload);

        if (!result) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Like");
        }

        return "Liked Successfully";
    }
};



const likeCountFromDB = async (user: JwtPayload, course: string): Promise<ILike | {}> => {

    const result = await Like.countDocuments({
        course:  course
    })

    return result;
}

export const LikeService = {
    toggleLikeToDB,
    likeCountFromDB
}