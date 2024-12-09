import { Model, Types } from "mongoose"

export type IProgress = {
    topic: Types.ObjectId;
    lesson: Types.ObjectId;
    student: Types.ObjectId;
}

export type ProgressModel = Model<IProgress, Record<string, undefined>>