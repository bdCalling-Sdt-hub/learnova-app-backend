import { Model, Types } from "mongoose";


export type IEnroll = {
    student: Types.ObjectId;
    course: Types.ObjectId; 
    teacher: Types.ObjectId;
}

export type EnrollModel = Model<IEnroll, Record<string, unknown>>