import { model, Schema } from "mongoose";
import { ILike, LikeModel } from "./like.interface";

const likesSchema = new Schema<ILike>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course", // Reference to the Course model
            required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Like = model<ILike, LikeModel>("Like", likesSchema);