import mongoose from "mongoose";
import { ILesson } from "./lesson.interface";
import { Lesson } from "./lesson.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Course } from "../course/course.model";

const createLessonToDB = async (payload: ILesson): Promise<ILesson | null> => {
    const course = await Course.findById(payload.course)
        .select("teacher")
        .populate("teacher");

    if ((payload as any).teacher !== course?.teacher?._id.toString()) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You haven't permission to add lesson on this Course")
    }
    const result = await Lesson.create(payload);
    return result;
};

const getLessonByCourseFromDB = async (id: string): Promise<ILesson[]> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    const result = await Lesson.find({ course: id });
    return result;
};

const lessonDetailsFromDB = async (id: string): Promise<ILesson | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    const result = await Lesson.findById(id);
    return result;
};

export const LessonService = {
    createLessonToDB,
    getLessonByCourseFromDB,
    lessonDetailsFromDB
};
