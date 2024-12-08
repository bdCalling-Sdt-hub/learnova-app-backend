import { Model, Types } from "mongoose";
import { Level } from "../short/short.interface";

export enum Grade {
    Primary1 = "Primary 1",
    Primary2 = "Primary 2",
    Primary3 = "Primary 3",
    Primary4 = "Primary 4",
    Primary5 = "Primary 5",
    Primary6 = "Primary 6",
    Form1 = "Form 1",
    Form2 = "Form 2",
    Form3 = "Form 3",
    Form4 = "Form 4",
    Form5 = "Form 5",
    Form6 = "Form 6",
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
    grade: Grade;
    aboutTeacher: string;
};

// Create the Mongoose model for Course
export type CourseModel = Model<ICourse, Record<string, unknown>>;
