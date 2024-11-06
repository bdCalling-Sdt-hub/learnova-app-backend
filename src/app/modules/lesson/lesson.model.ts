import { Schema, model } from "mongoose";
import { ILesson, LessonModel } from "./lesson.interface";

const noteSchema = new Schema(
    {
        topic: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
    }, 
    { _id: false }
);

// Define the Mongoose schema for Lesson
const lessonSchema = new Schema<ILesson, LessonModel>(
    {
        video: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            // required: true,
        },
        notes: { type: [noteSchema]},
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course", // Reference to the Course model
            // required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher", // Reference to the Teacher model
            // required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Lesson = model<ILesson, LessonModel>("Lesson", lessonSchema);