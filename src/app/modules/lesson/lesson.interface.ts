import { Model, Types } from "mongoose";

export type ILesson = {
    title: string;
    course: Types.ObjectId;
};

export type LessonModel = Model<ILesson, Record<string, unknown>>;