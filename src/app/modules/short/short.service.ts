import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IShort } from "./short.interface";
import { Short } from "./short.model";
import { JwtPayload } from "jsonwebtoken";
import { View } from "../view/view.mode";
import { Like } from "../like/like.model";
import mongoose from "mongoose";

const createShortToDB = async (payload: IShort): Promise<IShort> => {
    const result = await Short.create(payload);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Shorts");
    return result;
}

const getShortFromDB = async (user: JwtPayload, search: String): Promise<IShort[]> => {

    const anyConditions = [];

    anyConditions.push({teacher: user.id});

    if (search) {
        anyConditions.push({
            $or: ["title", "description", "subject", "level", "suitable", "aboutTeacher"].map((field) => ({
                [field]: {
                    $regex: search,
                    $options: "i"
                }
            }))
        });
    }

    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};

    const result: IShort[] = await Short.find(whereConditions).select("title cover createdAt").lean();

    if (!result) return [];

    const shorts = await Promise.all(result?.map(async (short: any) => {
        return {
            ...short,
            views: await View.countDocuments({ teacher: user.id, short: short._id }) || 0,
            likes: await Like.countDocuments({ teacher: user.id, short: short._id }) || 0,
        }
    }));

    return shorts;
}

const shortDetailsFromDB = async (id: string, query: Record<string, unknown>): Promise<IShort | {}> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const result = await Short.findById(id)
        .select("title video subject createdAt level suitable");

    if (!result) return {};

    const { duration } = query; // "weekly" or "monthly"

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (duration === "weekly") {
        startDate.setDate(startDate.getDate() - 7);
    } else if (duration === "monthly") {
        startDate.setDate(startDate.getDate() - 30);
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Fetch total views within the duration
    const totalView = await View.countDocuments({
        short: id,
        createdAt: { $gte: startDate, $lt: endDate }
    } as any);
    
    // Fetch total like 
    const totalLike = await Like.countDocuments({
        short: id,
        createdAt: { $gte: startDate, $lt: endDate }
    } as any);

    // average view
    const totalWatchTime = await View.aggregate([
        {
            $match: {
                short: id,
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalSeconds: { $sum: "$watchTime" } // Sum up all watch times in seconds
            }
        },
        {
            $project: {
                _id: 0,
                totalHours: { $divide: ["$totalSeconds", 3600] } // Convert seconds to hours
            }
        }
    ]);    

    const data = {
        ...result.toObject(), // Convert Mongoose document to plain object
        totalView: totalView || 0,
        totalLike: totalLike || 0,
        totalWatchTime: totalWatchTime || 0
    };

    return data;
};

export const ShortService = {
    createShortToDB,
    getShortFromDB,
    shortDetailsFromDB
}