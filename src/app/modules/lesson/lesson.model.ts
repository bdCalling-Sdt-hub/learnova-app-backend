import { Schema, model } from "mongoose";
import { ILesson, LessonModel } from "./lesson.interface";

// Define the Mongoose schema for Lesson
const lessonSchema = new Schema<ILesson, LessonModel>(
    {
        
        title: {
            type: String,
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course", // Reference to the Course model
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Lesson = model<ILesson, LessonModel>("Lesson", lessonSchema);