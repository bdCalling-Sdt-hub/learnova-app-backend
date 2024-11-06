import { Model, Types } from "mongoose";

export type IFollowing = {
    teacher: Types.ObjectId;
    student: Types.ObjectId;
};

export type FollowingModel = Model<IFollowing, Record<string, unknown>>