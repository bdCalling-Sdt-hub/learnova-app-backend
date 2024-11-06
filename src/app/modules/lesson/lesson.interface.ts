import { Model, Types } from "mongoose";

type Note = {
    topic: string;
    title: string;
    description: string;
};

export type ILesson = {
    video: string;
    title: string;
    notes: Note[]; // Array of Note objects
    course: Types.ObjectId; // Reference to the Course model
    teacher: Types.ObjectId; // Reference to the Teacher model
};

export type LessonModel = Model<ILesson, Record<string, unknown>>;