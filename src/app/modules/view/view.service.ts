import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IView } from "./view.interface";
import { View } from "./view.mode";
import { JwtPayload } from "jsonwebtoken";

const createViewToDB = async (payload: IView): Promise<IView | null> => {

    const query = {
        student: payload.student,
        course: payload.course,
        lesson: payload.lesson,
    }

    const isExistView = await View.findOne(query)

    if (isExistView && isExistView?.watchTime < payload.watchTime) {
        const result = await View.findByIdAndUpdate(
            query,
            { watchTime: payload.watchTime },
            { new: true }
        )
        return result;
    } else {
        const result = await View.create(payload);
        if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created View");

        return result;
    }


}

const viewStatisticFromDB = async (user: JwtPayload, query: string): Promise<{ day: string; totalView: number }[]> => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Start of the next month

    let daysArray: { day: string; totalView: number }[] = [];

    // Initialize daysArray based on the query parameter
    if (query === "monthly") {
        daysArray = Array.from(
            { length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }
            , (_, i) => ({ day: (i + 1).toString(), totalView: 0 }));
    } else {
        daysArray = Array.from({ length: 7 }, (_, i) => ({ day: (i + 1).toString(), totalView: 0 }));
    }

    // Calculate view statistics based on query
    const viewStatistics = await View.aggregate([
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
                totalView: { $sum: 1 }
            }
        }
    ]);

    // Update daysArray with the calculated statistics
    viewStatistics.forEach((stat: any) => {
        const dayIndex = parseInt(stat._id.day) - 1;
        if (dayIndex < daysArray.length) {
            daysArray[dayIndex].totalView = stat.totalView;
        }
    });

    return daysArray;
};

const watchTimeStatisticFromDB = async (user: JwtPayload, query: string): Promise<{ day: string; totalHour: number }[]> => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Start of the next month

    let daysArray: { day: string; totalHour: number }[] = [];

    // Initialize daysArray based on the query parameter
    if (query === "monthly") {
        daysArray = Array.from(
            { length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }
            , (_, i) => ({ day: (i + 1).toString(), totalHour: 0 }));
    } else{
        daysArray = Array.from({ length: 7 }, (_, i) => ({ day: (i + 1).toString(), totalHour: 0 }));
    }

    // Calculate view statistics based on query
    const viewStatistics = await View.aggregate([
        {
            $match: {
                teacher: user.id,
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: { day: { $dayOfMonth: "$createdAt" } },
                totalWatchTime: { $sum: "$watchTime" }
            }
        },
        {
            $project: {
                day: { $toString: "$_id.day" },
                totalHour: { $divide: ["$totalWatchTime", 3600] } // Convert watchTime to hours
            }
        }
    ]);

    // Update daysArray with the calculated statistics
    viewStatistics.forEach((start: any) => {
        const dayIndex = parseInt(start.day) - 1;
        if (dayIndex < daysArray.length) {
            daysArray[dayIndex].totalHour = start.totalHour;
        }
    });

    return daysArray;
};



export const ViewService = {
    createViewToDB,
    viewStatisticFromDB,
    watchTimeStatisticFromDB
}