import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IQuiz } from "./quiz.interface";
import { Quiz } from "./quiz.model";

const createQuizToDB = async(payload: IQuiz): Promise<IQuiz>=>{
    const result = await Quiz.create(payload);
    if(!result) throw new ApiError(StatusCodes.OK, "Failed to created Quiz");
    return result;
}

export const QuizService = {
    createQuizToDB
}