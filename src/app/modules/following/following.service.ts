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

const followerStatisticFromDB = async (user: JwtPayload , query: string): Promise<{ day: string; totalFollower: number }[]> => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Start of the next month

    let daysArray: { day: string; totalFollower: number }[] = [];

    // Initialize daysArray based on the query parameter
    if (query === "weekly") {
        daysArray = Array.from({ length: 7 }, (_, i) => ({ day: (i + 1).toString(), totalFollower: 0 }));
    } else if (query === "monthly") {
        daysArray = Array.from({ length: 30 }, (_, i) => ({ day: (i + 1).toString(), totalFollower: 0 }));
    } else {
        throw new Error("Invalid query parameter. It should be either 'weekly' or 'monthly'.");
    }

    // Calculate view statistics based on query
    const viewStatistics = await Following.aggregate([
        {
            $match: {
                teacher: user.id,
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" }
                },
                totalFollower: { $sum: 1 }
            }
        }
    ]);

    // Update daysArray with the calculated statistics
    viewStatistics.forEach((start: any) => {
        const dayIndex = parseInt(start._id.day) - 1;
        if (dayIndex < daysArray.length) {
            daysArray[dayIndex].totalFollower = start.totalFollower;
        }
    });

    return daysArray;
};

export const FollowingService = {
    toggleFollowingToDB,
    followingCountFromDB,
    followerStatisticFromDB
}