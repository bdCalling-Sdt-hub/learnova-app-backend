import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IShort } from "./short.interface";
import { Short } from "./short.model";
import { JwtPayload } from "jsonwebtoken";
import { View } from "../view/view.mode";
import { Like } from "../like/like.model";
import mongoose from "mongoose";
import { Following } from "../following/following.model";
import { Quiz } from "../quiz/quiz.model";
import QueryBuilder from "../../../helpers/apiFeature";

const createShortToDB = async (payload: IShort): Promise<IShort> => {
    const result = await Short.create(payload);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Shorts");
    return result;
}

const getShortFromDB = async (user: JwtPayload, query: Record<string, unknown>): Promise<IShort[]> => {

    const { search, sort, following, ...others } = query;

    const anyConditions = [];

    // search conditions
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

    // following conditions
    if (following) {
        const teacherIds = await Following.find({ student: user.id }).distinct("teacher");

        anyConditions.push({
            teacher: { $in: teacherIds }
        })
    }

    // Additional filters for other fields
    if (Object.keys(others).length) {
        anyConditions.push({
            $and: Object.entries(others).map(([field, value]) => ({
                [field]: value
            }))
        });
    }

    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};

    // Default sort or custom sort
    const sortOption: any = { createdAt: sort ? -1 : 1 };

    const result: IShort[] = await Short.find(whereConditions).select("title teacher cover createdAt")
        .lean()
        .sort(sortOption) // Apply sort here
        .populate({
            path: "teacher",
            select: "name profile"
        });

    return result;
}

const singleShortFromDB = async (user: JwtPayload, id: string): Promise<IShort | Record<string, any>> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Short ID");
    }

    // Fetch the Short document and populate teacher details
    const result = await Short.findById(id)
        .select("title teacher video description")
        .lean()
        .populate({
            path: "teacher",
            select: "name profile",
        });

    // If the Short is not found, return an empty object
    if (!result) {
        return {};
    }

    // Check if the user is following the teacher
    const isFollowing = await Following.exists({
        teacher: result.teacher._id,
        student: user.id,
    });

    // Check if the user is following the teacher
    const isLiked = await Like.exists({ short: result._id });

    // Return the result with the following status
    return {
        ...result,
        following: !!isFollowing,
        like: !!isLiked,
    };
};


const getReelsFromDB = async (user: JwtPayload): Promise<IShort[]> => {

    // Fetch the Short document and populate teacher details
    const shorts = await Short.find({})
        .select("title teacher video description")
        .lean()
        .populate({
            path: "teacher",
            select: "name profile",
        });

    // If the Short is not found, return an empty object
    if (!shorts) {
        return [];
    }

    const result: IShort[] = await Promise.all(shorts?.map(async (short: any) => {

        // Check if the user is following the teacher
        const isFollowing = await Following.exists({
            teacher: short?.teacher?._id,
            student: user.id,
        });

        // Check if the user liked the short
        const isLiked = await Like.exists({ short: short?._id });

        return {
            ...short,
            following: !!isFollowing,
            liked: !!isLiked
        };
    }));

    return result
};

const teacherShortFromDB = async (user: JwtPayload, query: Record<string, unknown>): Promise<IShort[]> => {

    const { search, ...others } = query;
    const anyConditions = [];
    anyConditions.push({ teacher: user.id });

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

    const result: IShort[] = await Short.find(whereConditions)
        .populate({
            path: "teacher",
            select: "name"
        })
        .select("title cover teacher createdAt ")
        .lean();

    // if (!result) return [];

    const shorts = await Promise.all(result?.map(async (short: any) => {
        return {
            ...short,
            views: await View.countDocuments({ short: short._id }),
            likes: await Like.countDocuments({ short: short._id })
        }
    }));

    return shorts;
}

const shortDetailsForTeacherFromDB = async (id: string, query: Record<string, unknown>): Promise<IShort | {}> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const result = await Short.findById(id)
        .select("title video subject createdAt level suitable")
        .lean();

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
        ...result,
        analytics: {
            totalView: totalView,
            totalLike: totalLike,
            totalWatchTime: totalWatchTime[0]?.totalWatchTime || 0
        }
    };

    return data;
};

const shortPreviewFromDB = async (id: string): Promise<IShort | {}> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const [short, quizzes] = await Promise.all([
        Short.findById(id).lean().populate({ path: "teacher", select: "name" }),
        Quiz.find({ short: id }).select("question")
    ]);

    if (!short) throw new ApiError(StatusCodes.NOT_FOUND, "Short not found");

    return {
        ...short,
        quizzes
    };
};


const deleteShortFromDB = async (id: string): Promise<IShort> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const result = await Short.findByIdAndDelete(id);
    if(!result) throw new ApiError(StatusCodes.NOT_FOUND, "Short not found");
    return result;
};

const shortsFromDB = async (query: Record<string, any>): Promise<{shorts: IShort[], pagination:any }> => {
    
    const result = new QueryBuilder(Short.find(), query).paginate();
    const shorts = await result.queryModel.lean();
    const pagination = await result.getPaginationInfo();
    return { shorts, pagination };
};

export const ShortService = {
    createShortToDB,
    getShortFromDB,
    shortDetailsForTeacherFromDB,
    teacherShortFromDB,
    singleShortFromDB,
    getReelsFromDB,
    shortPreviewFromDB,
    deleteShortFromDB,
    shortsFromDB
}