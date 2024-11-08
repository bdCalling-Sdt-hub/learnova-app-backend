import { Model, Types } from "mongoose";

export type ILike = {
    course?: Types.ObjectId;
    short?: Types.ObjectId;
    teacher: Types.ObjectId;
    student: Types.ObjectId;
};

export type LikeModel = Model<ILike, Record<string, unknown>>