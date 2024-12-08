import { Model, Types } from "mongoose";

// Define an enum for the level
export enum Level {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}

// Define the Shorts interface
export type IShort = {
    cover: string;
    video: string;
    title: string;
    subject: string;
    description: string;
    level: Level;
    suitable: string;
    teacher: Types.ObjectId; // Reference to a Teacher
};

export type ShortsModel = Model<IShort, Record<string, unknown>>;