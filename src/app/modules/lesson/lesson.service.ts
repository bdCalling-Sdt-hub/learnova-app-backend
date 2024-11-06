import mongoose from "mongoose";
import { ILesson } from "./lesson.interface";
import { Lesson } from "./lesson.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";

const createLessonToDB = async (payload: ILesson): Promise<ILesson | null> => {
    const result = await Lesson.create(payload);
    return result;
};

const getLessonByCourseFromDB = async (id: string): Promise<ILesson[]> => {

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    const result = await Lesson.find({course: id});
    return result;
};

const lessonDetailsFromDB = async (id: string): Promise<ILesson | null> => {

    if(!mongoose.Types.ObjectId.isValid(id)){
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
