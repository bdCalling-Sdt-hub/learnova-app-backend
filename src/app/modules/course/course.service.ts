import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";
import { JwtPayload } from "jsonwebtoken";
import { View } from "../view/view.mode";
import { Like } from "../like/like.model";
import mongoose from "mongoose";
import { Bio } from "../bio/bio.model";

const createCourseToDB = async (payload: ICourse): Promise<ICourse | null> => {
    const result: ICourse = await Course.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_GATEWAY, "Failed to created Course");
    }

    return result;
}

const getCourseFromDB = async (user: JwtPayload, search: String): Promise<ICourse[]> => {

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

    const result: ICourse[] = await Course.find(whereConditions).select("title cover createdAt").lean();

    if (!result) return [];

    const courses = await Promise.all(result?.map(async (course: any) => {
        return {
            ...course,
            views: await View.countDocuments({ teacher: user.id, course: course._id }) || 0,
            likes: await Like.countDocuments({ course: course._id }) || 0,
        }
    }));

    return courses;
}

const getCourseForStudentFromDB = async (user: JwtPayload, query: Record<string, unknown>): Promise<ICourse | {}> => {

    // get the student grade for level content
    const student = await Bio.findOne({ student: user.id }).select("grade");
    if (!student) {
        return {};
    }

    const { subject } = query;

    const conditions: Record<string, unknown> = {
        grade: student.grade,
        ...(subject as object && { subject }),
    };

    const result: ICourse[] = await Course.find(conditions)
        .select("title cover subject level teacher")
        .populate({
            path: "teacher",
            select: "name"
        })
        .lean();

    if (!result) return {};

    const personalizedCourse = await Promise.all(
        result?.map(async (course: any) => {
            return {
                ...course,
                likes: await Like.countDocuments({ course: course._id }),
            }
        })
    );

    const trendingCourse =  personalizedCourse.sort((a, b) => b.likes - a.likes);


    return { personalizedCourse, trendingCourse };
}

const courseDetailsFromDB = async (id: string, query: Record<string, unknown>): Promise<ICourse | {}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const result = await Course.findById(id)
        .select("video title createdAt subject level description suitable");

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
        course: id,
        createdAt: { $gte: startDate, $lt: endDate }
    } as any);

    // Fetch total like 
    const totalLike = await Like.countDocuments({
        course: id,
        createdAt: { $gte: startDate, $lt: endDate }
    } as any);

    // average view
    const totalWatchTime = await View.aggregate([
        {
            $match: {
                course: id,
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
        ...result.toObject(),
        totalView: totalView || 0,
        totalLike: totalLike || 0,
        totalWatchTime: totalWatchTime || 0
    };

    return data;
};

const courseDetailsStatisticFromDB = async (id: string, query: string): Promise<ICourse | {}> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    const result = await Course.findById(id)
        .select("video title createdAt subject level description suitable");

    if (!result) return {};

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

    const [teacher] = await Promise.all([
        View.aggregate([
            {
                $match: {
                    course: id,
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
        ])
    ]);

    return teacher;
}

export const CourseService = {
    createCourseToDB,
    getCourseFromDB,
    courseDetailsFromDB,
    courseDetailsStatisticFromDB,
    getCourseForStudentFromDB
}