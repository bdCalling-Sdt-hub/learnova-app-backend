import { model, Schema } from "mongoose";
import { CourseModel, ICourse } from "./course.interface";
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
            ref: "USER", // Reference to the Teacher model
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true
    }
);
export const Course = model<ICourse>("Course", courseSchema);