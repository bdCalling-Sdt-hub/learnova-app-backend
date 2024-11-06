import { model, Schema } from "mongoose";
import { IView, ViewModel } from "./view.interface";

const viewSchema = new Schema<IView, ViewModel>(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course", // Reference to the Course model
            required: true,
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: "Lesson", // Reference to the Course model
            required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        watchTime: {
            type: Number,
            required: true
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const View = model<IView, ViewModel>("View", viewSchema);