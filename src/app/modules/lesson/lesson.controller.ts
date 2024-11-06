import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { LessonService } from "./lesson.service";

const createLesson = catchAsync(async (req: Request, res: Response) => {

    const payload = {
        teacher: req.user.id,
        ...req.body
    }

    const result = await LessonService.createLessonToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Lesson Created Successfully',
        data: result,
    });
})

const getLessonByCourse = catchAsync(async (req: Request, res: Response) => {

    const result = await LessonService.getLessonByCourseFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Lesson Retrieved Successfully',
        data: result,
    });
})

const lessonDetails = catchAsync(async (req: Request, res: Response) => {

    const result = await LessonService.lessonDetailsFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Lesson Details Retrieved Successfully',
        data: result,
    });
})

export const LessonController = {
    createLesson,
    getLessonByCourse,
    lessonDetails
}