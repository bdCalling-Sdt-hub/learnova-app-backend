import { model, Schema } from "mongoose";
import { IFollowing, FollowingModel } from "./following.interface";

const followingsSchema = new Schema<IFollowing>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
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

export const Following = model<IFollowing, FollowingModel>("Following", followingsSchema);