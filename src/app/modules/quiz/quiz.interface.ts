import { Model, Types } from "mongoose";

// Define the Quiz interface
export type IQuiz = {
    question: string;
    option: [string, string, string, string]; // Array of exactly 4 strings
    answer: string;
    explanation: string;
    short?: Types.ObjectId;
    topic?: Types.ObjectId;
    teacher: Types.ObjectId;
};


export type QuizModel = Model<IQuiz, Record<string, unknown>>;