import mongoose from "mongoose";
import { IFollowing } from "./following.interface";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Following } from "./following.model";
import { JwtPayload } from "jsonwebtoken";

const toggleFollowingToDB = async (payload: IFollowing): Promise<string> => {

    if (!mongoose.Types.ObjectId.isValid(payload.student)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Student ID");
    }

    const isExist = await Following.findOne({
        student: payload.student,
        teacher: payload.teacher
    })

    if (isExist) {
        await Following.findByIdAndDelete(isExist._id);
        return "UnFollowing This Course"
    } else {
        const result = await Following.create(payload);

        if (!result) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to following")
        }

        return "Following This Course"
    }
}


const followingCountFromDB = async (user: JwtPayload, course: string): Promise<IFollowing | {}> => {

    const result = await Following.countDocuments({ 
        teacher: user.id
    })

    return result;
}

export const FollowingService = {
    toggleFollowingToDB,
    followingCountFromDB
}