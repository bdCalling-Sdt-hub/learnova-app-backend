import { Schema, model } from "mongoose";
import { IShort, Level, ShortsModel } from "./short.interface";

// Define the Mongoose schema for Shorts
const shortSchema = new Schema<IShort, ShortsModel>(
    {
        cover: {
            type: String,
            required: true,
        },
        video: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: Object.values(Level),
            required: true,
        },
        suitable: {
            type: String,
            required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the Teacher model
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Short = model<IShort, ShortsModel>("Short", shortSchema);