import mongoose from "mongoose";
import { IEnroll } from "./enroll.interface";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Enroll } from "./enroll.model";
import { JwtPayload } from "jsonwebtoken";
import { Lesson } from "../lesson/lesson.model";
import { Course } from "../course/course.model";
import { Topic } from "../topic/topic.model";
import { Progress } from "../progress/progress.model";

const createEnrollCourseToDB = async (payload: IEnroll): Promise<IEnroll> => {

    const { course, teacher, student } = payload;

    if (!mongoose.Types.ObjectId.isValid(course)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Course ID");
    }

    if (!mongoose.Types.ObjectId.isValid(teacher)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Teacher ID");
    }

    const isExistEnroll = await Enroll.findOne({ course, student })

    if (isExistEnroll) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You are already enrolled in this course");
    }

    const enroll = await Enroll.create(payload);

    if (!enroll) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to enroll in the course");
    }

    return enroll;
}


const enrollCourseDetailsFromDB = async (id: string): Promise<{}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.CONFLICT, "Invalid Course ID");
    }

    const courses: any = await Course.findById(id)
        .populate([
            {
                path: "teacher",
                select: "profile name"
            }
        ])
        .select("createdAt level subject title teacher").lean();

    const lessons = await Lesson.find({ course: id }).lean();

    // Fetch all topics for the lessons in bulk
    const lessonIds = lessons.map(lesson => lesson._id);
    const topics = await Topic.find({ lesson: { $in: lessonIds } }).lean();

    // Fetch all progress entries for the student for these topics
    const progressEntries = await Progress.find({
        topic: { $in: topics.map(topic => topic._id) },
    }).select("topic").lean();

    // Create a Set for fast lookup of completed topic IDs
    const completedTopicIds = new Set(progressEntries.map(entry => entry.topic.toString()));

    // Map lessons to include their topics with completion status
    const progressLesson = lessons.map(lesson => {
        const lessonTopics = topics.filter(topic => topic.lesson.toString() === lesson._id.toString());
        const progressTopic = lessonTopics.map(topic => ({
            ...topic,
            isComplete: completedTopicIds.has(topic._id.toString()),
        }));

        return {
            ...lesson,
            topics: progressTopic,
        };
    });


    const data = {
        ...courses,
        progressLesson
    }
    return data;
}

export const EnrollService = {
    createEnrollCourseToDB,
    enrollCourseDetailsFromDB
}
