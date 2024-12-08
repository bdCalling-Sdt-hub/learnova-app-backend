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
            required: false,
        },
        short: {
            type: Schema.Types.ObjectId,
            ref: "Short", // Reference to the Short model
            required: false,
        }
    },
    {
        timestamps: true
    }
);

export const Like = model<ILike, LikeModel>("Like", likesSchema);