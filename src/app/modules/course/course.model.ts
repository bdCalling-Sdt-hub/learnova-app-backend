import { model, Schema } from "mongoose";
import { CourseModel, Grade, ICourse } from "./course.interface";
import { Level } from "../short/short.interface";

// Define the Mongoose schema for Course
const courseSchema = new Schema<ICourse, CourseModel>(
    {
        cover: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: Object.values(Level), // Allows only specified level values
            required: true,
        },
        grade: {
            type: String,
            enum: Object.values(Grade),
            required: true
        },
        suitable: {
            type: String,
            required: true,
        },
        aboutTeacher: {
            type: String,
            required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the Teacher model
            required: true,
        }
    },
    {
        timestamps: true
    }
);
export const Course = model<ICourse>("Course", courseSchema);