import { model, Schema } from "mongoose";
import { IProgress, ProgressModel } from "./progress.interface";

const progressSchema = new Schema<IProgress, ProgressModel>(
    {
        topic: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            required: true
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Progress = model<IProgress, ProgressModel>("Progress", progressSchema) 