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

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID');
    }


    if( status !== 'Restricted' && status !== 'Pending' && status !== 'Approved' ){
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
    }

    const teacher = await User.findByIdAndUpdate(
        {_id: id},
        {status: status },
        {new: true}
    );


    if(!teacher){
        throw new ApiError(StatusCodes.NOT_FOUND, 'Teacher not found');
    }

    return teacher;
};

export const AdminService = {
    getStudentsFromDB,
    getTeachersFromDB,
    studentDetailsFromDB,
    teacherDetailsFromDB,
    chartAnalyticsFromDB,
    topCoursesAndShortsFromDB,
    approvedAndRejectedTeacherFromDB
}