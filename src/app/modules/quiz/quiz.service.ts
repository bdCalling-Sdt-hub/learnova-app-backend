import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IQuiz } from "./quiz.interface";
import { Quiz } from "./quiz.model";
import mongoose from "mongoose";

const createQuizToDB = async (payload: IQuiz): Promise<IQuiz> => {
    const result = await Quiz.create(payload);
    if (!result) throw new ApiError(StatusCodes.OK, "Failed to created Quiz");
    return result;
}

const quizDetailsFromDB = async (id: string): Promise<IQuiz | {}> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Quiz ID");
    }

    const quiz: any = await Quiz.findOne({
        $or: [{ short: id }, { topic: id }]
    })
        .populate([
            {
                path: "short",
                select: "subject"
            },
            {
                path: "topic",
                select: "subject"
            },
        ]);

    // console.log(first)
    return quiz;
}

export const QuizService = {
    createQuizToDB,
    quizDetailsFromDB
}