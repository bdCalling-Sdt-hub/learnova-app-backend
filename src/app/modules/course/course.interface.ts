import { Model, Schema, model, Types } from "mongoose";

// Define an enum for the level
enum Level {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advance = "Advance"
}

// Define the Course interface
export type ICourse = {
    teacher: Types.ObjectId; // Reference to a Teacher model
    cover: string;
    title: string;
    description: string;
    subject: string;
    level: Level;
    suitable: string;
    aboutTeacher: string;
    rating: number;
    ratingCount: number;
};

// Create the Mongoose model for Course
export type CourseModel = Model<ICourse, Record<string, unknown>>;
