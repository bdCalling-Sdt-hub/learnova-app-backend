import { Model, Types } from "mongoose";

export type IView = {
    course?: Types.ObjectId;
    lesson?: Types.ObjectId;
    short?: Types.ObjectId;
    student: Types.ObjectId;
    teacher: Types.ObjectId;
    watchTime?: number;
};

export type ViewModel = Model<IView, Record<string, unknown>>