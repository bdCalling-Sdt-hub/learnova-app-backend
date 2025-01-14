import mongoose from "mongoose";
import { ILesson } from "./lesson.interface";
import { Lesson } from "./lesson.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Course } from "../course/course.model";
import { Topic } from "../topic/topic.model";
import { Quiz } from "../quiz/quiz.model";

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

const updateLessonToDB = async (id: string, payload: ILesson): Promise<{}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    const updatedLesson = await Lesson.findByIdAndUpdate(
        { _id: id },
        payload,
        {new: true}
    );

    if(!updatedLesson){
        throw new ApiError(StatusCodes.CONFLICT, "Failed to Updated Lesson");
    }
    return updatedLesson;
};

const lessonDetailsFromDB = async (id: string): Promise<ILesson | {}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }

    const [lesson, topics] = await Promise.all([
        Lesson.findById(id).select("title createdAt").lean(),
        Topic.find({lesson: id}).select("title topic createdAt").lean()
    ]);

    if(!lesson){
        throw new ApiError(StatusCodes.NOT_FOUND, "Lesson not found");
    }

    const topicWithQuiz = await Promise.all(topics?.map(async (topic: any) => {
        const quiz = await Quiz.findOne({topic: topic._id}).select("question").lean();
        return {...topic, quiz};
    }));

    return {
        ...lesson,
        topics: topicWithQuiz
    };
};

const deleteLessonToDB = async (id: string): Promise<ILesson | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }
    
    const result = await Lesson.findByIdAndDelete(id);
    if(!result){
        throw new ApiError(StatusCodes.CONFLICT, "Failed to Deleted Lesson");
    }
    return result;
};

export const LessonService = {
    createLessonToDB,
    updateLessonToDB,
    deleteLessonToDB,
    lessonDetailsFromDB
};
