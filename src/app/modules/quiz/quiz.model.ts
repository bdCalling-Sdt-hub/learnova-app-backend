import { model, Schema } from "mongoose";
import { IQuiz, QuizModel } from "./quiz.interface";

const quizSchema = new Schema<IQuiz, QuizModel>(
    {
        question: {
            type: String,
            required: true,
        },
        option: {
            type: [String],
            validate: {
                validator: (options: string[]) => options.length === 4,
                message: "Options array must contain exactly 4 items.",
            },
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            required: true,
        },
        short: {
            type: Schema.Types.ObjectId,
            required: false,
        },
        course: {
            type: Schema.Types.ObjectId,
            required: false,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Quiz = model<IQuiz, QuizModel>("Quiz", quizSchema);