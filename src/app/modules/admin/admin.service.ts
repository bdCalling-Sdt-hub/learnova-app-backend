import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import QueryBuilder from "../../../helpers/apiFeature";
import { Subscription } from "../subscription/subscription.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { Enroll } from "../enroll/enroll.model";
import { Bio } from "../bio/bio.model";
import { Course } from "../course/course.model";
import { View } from "../view/view.mode";
import { USER_ROLES } from "../../../enums/user";
import { Short } from "../short/short.model";
import { Quiz } from "../quiz/quiz.model";

const getStudentsFromDB = async (query: Record<string, any>): Promise<{ students: IUser[], pagination: any }> => {

    const apiFeatures = new QueryBuilder(User.find({ role: 'STUDENT' }), query).paginate();
    const students = await apiFeatures.queryModel.lean();
    const pagination = await apiFeatures.getPaginationInfo();

    const result = await Promise.all(students.map(async (student: any) => {
        const bio = await Bio.findOne({ student: student._id }).select("grade school subject -_id").lean();
        const subscription: any = await Subscription.findOne({ user: student._id }).populate("package", "duration").lean();
        return {
            ...student,
            ...bio,
            subscription: subscription?.package.duration || null
        };
    }));

    return { students: result, pagination };
}

const getTeachersFromDB = async (query: Record<string, any>): Promise<{ teachers: IUser[], pagination: any }> => {
    const apiFeatures = new QueryBuilder(User.find({ role: 'TEACHER' }), query).paginate();
    const teachers = await apiFeatures.queryModel;
    const pagination = await apiFeatures.getPaginationInfo();


    return { teachers, pagination };
}


const studentDetailsFromDB = async (id: string): Promise<{}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Student ID');
    }

    const student = await User.findById(id).lean();
    if (!student) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Student not found');
    }

    const bio = await Bio.findOne({ student: id }).select("grade school subject -_id").lean();

    const enrollCourses = await Enroll.find({ student: id }).populate([
        {
            path: "course",
            populate: {
                path: "teacher",
                select: "name"
            }
        }
    ]);

    return {
        ...student,
        ...bio,
        enrollCourses
    };
}


const teacherDetailsFromDB = async (id: string): Promise<{}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Teacher ID');
    }

    const teacher = await User.findById(id).lean();
    if (!teacher) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Teacher not found');
    }

    const result = await Course.find({ teacher: id }).lean();

    const courses = await Promise.all(result?.map(async (course: any) => {
        const totalViews = await View.countDocuments({ course: course._id })
        return {
            ...course,
            totalViews
        };
    }));

    return {
        ...teacher,
        courses
    }
}

const chartAnalyticsFromDB = async () => {

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const totalEarningArray = Array.from(
        { length: 7 },
        (_, i) => (
            {
                day: daysOfWeek[i],
                total: 0
            }
        )
    );

    const totalEnrollmentsArray = Array.from(
        { length: 7 },
        (_, i) => (
            {
                day: daysOfWeek[i],
                total: 0
            }
        )
    );

    const subscriptionAnalytics = await Subscription.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" }
                },
                total: { $sum: 1 }
            }
        }
    ]);


    const enrollMentAnalytics = await Enroll.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" }
                },
                total: { $sum: 1 }
            }
        }
    ]);


    // Update daysArray with the calculated statistics
    subscriptionAnalytics.forEach((start: any) => {
        const dayIndex = parseInt(start.day) - 1;
        if (dayIndex < totalEarningArray.length) {
            totalEarningArray[dayIndex].total = start.total;
        }
    });

    // Update daysArray with the calculated statistics
    enrollMentAnalytics.forEach((start: any) => {
        const dayIndex = parseInt(start.day) - 1;
        if (dayIndex < totalEnrollmentsArray.length) {
            totalEnrollmentsArray[dayIndex].total = start.total;
        }
    });

    return {
        totalEarning: totalEarningArray,
        totalEnrollments: totalEnrollmentsArray
    }
}


const topCoursesAndShortsFromDB = async () => {
    const [courses, shorts] = await Promise.all([
        Course.find().populate("teacher", "name").lean(),
        Short.find().populate("teacher", "name").lean()
    ]);

    const topCourses = await Promise.all(courses?.map(async (course: any) => {
        const views = await View.countDocuments({ course: course._id });
        return {
            ...course,
            totalViews: views
        };
    }));

    // Sort after all promises have resolved
    topCourses.sort((a: any, b: any) => b.totalViews - a.totalViews);

    const topShorts = await Promise.all(shorts?.map(async (short: any) => {
        const views = await View.countDocuments({ short: short._id });
        return {
            ...short,
            totalViews: views
        };
    }));

    // Sort after all promises have resolved
    topShorts.sort((a: any, b: any) => b.totalViews - a.totalViews);

    return {
        topCourses,
        topShorts
    };
};

const approvedAndRejectedTeacherFromDB = async (id: string, status: string): Promise<IUser> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID');
    }


    if (status !== 'Restricted' && status !== 'Pending' && status !== 'Approved') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
    }

    const teacher = await User.findByIdAndUpdate(
        { _id: id },
        { status: status },
        { new: true }
    );


    if (!teacher) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Teacher not found');
    }

    return teacher;
};


const countSummaryFromDB = async () => {

    const totalUsers = await User.countDocuments({
        $and: [
            { role: { $ne: "SUPER-ADMIN" } },
            { role: { $ne: "ADMIN" } }
        ]
    });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const newSignsUp = await User.aggregate([
        {
            $match: {
                role: { $nin: ["SUPER-ADMIN", "ADMIN"] },
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 }
            }
        }
    ]);

    const totalQuiz = await Quiz.countDocuments();
    const totalShorts = await Short.countDocuments();
    const totalCourses = await Course.countDocuments()


    return { totalUsers, newSignsUp: newSignsUp[0]?.total, totalQuiz, totalShorts, totalCourses };

}

const salesRevenueFromDB = async () => {

    const now = new Date();

    // Get the start of the current week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Get the end of the current week (Next Monday at 00:00:00)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Initialize an array for 7 days with default count of 0
    const daysArray = Array.from({ length: 7 }, (_, i) => ({ day: (i + 1).toString(), total: 0 }));

    // Aggregate subscription statistics
    const salesStatistics = await Subscription.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
        {
            $group: {
                _id: { day: { $dayOfWeek: "$createdAt" } }, // Get day of the week (1 = Sunday, 2 = Monday, etc.)
                total: { $sum: 1 }
            }
        }
    ]);

    // Update daysArray with the calculated statistics
    salesStatistics.forEach((stat) => {
        const dayIndex = stat._id.day - 1; // Convert MongoDB's 1-based day index to 0-based
        if (dayIndex === 0) {
            daysArray[6].total = stat.total; // Convert Sunday (1 in MongoDB) to the last index (6)
        } else {
            daysArray[dayIndex - 1].total = stat.total; // Shift other days by 1
        }
    });


    return daysArray;
}

const percentageSubscriptionFromDB = async () => {
    const result = await Subscription.aggregate([
        {
            $lookup: {
                from: "packages",
                localField: "package",
                foreignField: "_id",
                as: "packageInfo"
            }
        },
        {
            $unwind: "$packageInfo"
        },
        {
            $group: {
                _id: "$packageInfo.duration",
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$count" },
                durations: { $push: { duration: "$_id", count: "$count" } }
            }
        },
        {
            $unwind: "$durations"
        },
        {
            $project: {
                _id: 0,
                duration: "$durations.duration",
                count: "$durations.count",
                percentage: { $multiply: [{ $divide: ["$durations.count", "$total"] }, 100] }
            }
        }
    ]);

    return result;
}


const metricsFromDB = async () => {

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const totalShorts = await Short.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 }
            }
        }
    ]);

    const totalCourses = await Course.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 }
            }
        }
    ]);

    const metrics = Array.from(
        { length: 7 }, 
        (_, i) => (
            { 
                day: (i + 1).toString(), 
                totalShort: 0, 
                totalCourse: 0 
            }
        )
    );


    const weeklyShorts = await Short.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
        {
            $group: {
                _id: { day: { $dayOfWeek: "$createdAt" } },
                totalShort: { $sum: 1 }
            }
        }
    ]);

    const weeklyCourses = await Course.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
        {
            $group: {
                _id: { day: { $dayOfWeek: "$createdAt" } },
                total: { $sum: 1 }
            }
        }
    ]);



    // Update daysArray with the calculated statistics
    weeklyShorts.forEach((stat) => {
        const dayIndex = stat._id.day - 1;
        if (dayIndex === 0) {
            metrics[6].totalShort = stat.totalShort;
        } else {
            metrics[dayIndex - 1].totalShort = stat.totalShort;
        }
    });

    // Update daysArray with the calculated statistics
    weeklyCourses.forEach((stat) => {
        const dayIndex = stat._id.day - 1;
        if (dayIndex === 0) {
            metrics[6].totalCourse = stat.totalCourse;
        } else {
            metrics[dayIndex - 1].totalCourse = stat.totalCourse;
        }
    });

    const data = {
        totalShorts: totalShorts[0]?.total || 0,
        weeklyShorts: weeklyShorts[0]?.totalShort || 0,
        weeklyCourses: weeklyCourses[0]?.total || 0,
        totalCourses: totalCourses[0]?.total || 0
    }
    return { ...data, metrics }

}


export const AdminService = {
    getStudentsFromDB,
    getTeachersFromDB,
    studentDetailsFromDB,
    teacherDetailsFromDB,
    chartAnalyticsFromDB,
    topCoursesAndShortsFromDB,
    approvedAndRejectedTeacherFromDB,
    countSummaryFromDB,
    salesRevenueFromDB,
    percentageSubscriptionFromDB,
    metricsFromDB
}