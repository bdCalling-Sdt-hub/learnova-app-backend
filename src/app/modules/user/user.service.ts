import { IUser } from "./user.interface";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";
import { ICreateAccount } from "../../../types/emailTemplate";
import { Following } from "../following/following.model";
import { View } from "../view/view.mode";
import { Course } from "../course/course.model";
import { Enroll } from "../enroll/enroll.model";
import { Lesson } from "../lesson/lesson.model";
import { Topic } from "../topic/topic.model";
import { Progress } from "../progress/progress.model";
import { Like } from "../like/like.model";
import { Short } from "../short/short.model";
import { sendNotifications } from "../../../helpers/notificationsHelper";

const createUserToDB = async (payload: Partial<IUser>) => {

    const createUser = await User.create(payload);
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    //send email
    const otp = generateOTP();
    const values: ICreateAccount = {
        name: createUser.name as string,
        otp: otp,
        email: createUser.email!
    };

    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };

    const user:any = await User.findOneAndUpdate(
        { _id: createUser._id },
        { $set: { authentication } }
    );

    if (payload.role === "TEACHER") {
        const data = {
            text: "A Teacher has been registered. Check it and approve it!",
            read: false,
            referenceId: user._id,
            screen: "REGISTER",
            type: "ADMIN"
        }
        sendNotifications(data);
    }

    return;
};

const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
    const { id } = user;
    const isExistUser: any = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
};

const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    const { id } = user;

    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //unlink file here
    if (payload.profile && isExistUser.profile?.startsWith("/")) {
        unlinkFile(isExistUser.profile);
    }

    const updateDoc = await User.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );
    return updateDoc;
};

const teacherHomeProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser | {}>> => {

    const [teacher, totalFollower, totalView, totalWatchTime] = await Promise.all([
        User.findById(user.id).select("name profile").lean(),
        Following.countDocuments({ teacher: user.id }),
        View.countDocuments({ teacher: user.id }),
        View.aggregate([
            { $match: { teacher: user.id } },
            {
                $group: {
                    _id: null,
                    totalWatchTime: { $sum: "$watchTime" }
                }
            },
            {
                $project: {
                    totalWatchTime: { $divide: ["$totalWatchTime", 3600] }
                }
            }
        ])
    ]);

    if (!teacher) return {};


    const courses = await Course.find({ teacher: user.id }).select("create title cover createdAt subject").lean();
    if (!courses) {
        return [];
    }

    const result = await Promise.all(courses?.map(async (course: any) => {

        const totalLike = await Like.countDocuments({ course: course._id });
        const totalView = await View.countDocuments({ course: course._id });

        return {
            ...course,
            totalLike,
            totalView
        }
    }));

    return {
        ...teacher,
        totalFollower,
        totalView,
        totalWatchTime: totalWatchTime[0]?.totalWatchTime || 0,
        courses: result

    };
};

const teacherProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser | {}>> => {

    const [teacher, totalCourses, totalShorts, courses] = await Promise.all([
        User.findById(user.id).select("name profile createdAt").lean(),
        Course.countDocuments({ teacher: user.id }),
        Short.countDocuments({ teacher: user.id }),
        Course.find({ teacher: user.id })
            .select("teacher level cover title")
            .populate({ path: "teacher", select: "name" })
            .lean(),
    ]);

    const coursesWithViews = await Promise.all(
        courses?.map(async (course: any) => {
            const views = await View.find({ course: course._id });
            return {
                ...course,
                viewCount: views.length,
            };
        })
    );

    const topViewingCourse = coursesWithViews.reduce((topCourse, currentCourse) => {
        return (currentCourse.viewCount > (topCourse?.viewCount || 0))
            ? currentCourse
            : topCourse;
    }, []);

    if (!teacher) return {};

    return {
        ...teacher,
        totalCourses,
        totalShorts,
        revenue: 0,
        topViewingCourse
    };
};

const studentProfileFromDB = async (user: JwtPayload): Promise<{}> => {

    const [student, courses] = await Promise.all([
        User.findById(user.id)
            .select("name profile createdAt isSubscribe")
            .lean(),
        Enroll.find({ student: user.id })
            .populate([
                {
                    path: "course",
                    select: "title subject level createdAt"
                },
                {
                    path: "teacher",
                    select: "profile name createdAt"
                },
            ])
            .select("course teacher createdAt")
    ]);

    if (!student) {
        return {}
    }



    const courseStatuses = await Promise.all(
        courses.map(async (course: any) => {
            const lessons = await Lesson.find({ course: course?.course?._id }).select("_id");

            for (const lesson of lessons) {
                const topics = await Topic.find({ lesson: lesson._id }).select("_id");

                // If any topic doesn't have a corresponding progress, mark as incomplete
                const completedTopics = await Progress.find({ topic: { $in: topics.map(t => t._id) } }).select("topic");
                if (completedTopics.length < topics.length) {
                    return false; // Course is not complete
                }
            }

            return true; // Course is complete
        })
    );

    const completedCourses = courseStatuses.filter(status => status).length;
    const progressCourses = courseStatuses.filter(status => !status).length;

    const totalFollowing = await Following.countDocuments({ student: user.id });

    const data = {
        ...student,
        courses,
        progressCourses,
        completedCourses,
        totalFollowing
    }

    return data;

}

export const UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    teacherHomeProfileFromDB,
    teacherProfileFromDB,
    studentProfileFromDB
};