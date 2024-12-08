import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { QuizService } from "./quiz.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createQuiz = catchAsync(async(req:Request, res: Response)=>{
    const payload = {
        teacher: req.user.id,
        ...req.body
    }
    const result = await QuizService.createQuizToDB(payload);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        success: true,
        message: "Quiz Created successfully",
        data: result
    })
});

const quizDetails = catchAsync(async(req:Request, res: Response)=>{

    const result = await QuizService.quizDetailsFromDB(req.params.id);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        success: true,
        message: "Quiz Details Retrieved successfully",
        data: result
    })
});

export const QuizController= { 
    createQuiz,
    quizDetails 
}