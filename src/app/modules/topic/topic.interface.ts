import { Model, Types } from "mongoose";

export type ITopic = {
    video: string;
    topic: string;
    title: string;
    notes: string;
    documents?: string;
    lesson: Types.ObjectId; // Reference to the Lesson model
};

export type TopicModel = Model<ITopic, Record<string, unknown>>;