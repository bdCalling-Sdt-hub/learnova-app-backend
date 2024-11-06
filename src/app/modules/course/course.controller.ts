import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async(req: Request, res: Response)=>{
    const payload = {
        teacher: req.user.id,
        ...req.body
    }
    const result = await CourseService.createCourseToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Created Successfully",
        data: result
    })
});

const getCourse = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.getCourseFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Retrieved Successfully",
        data: result
    })
});

const courseDetails = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.courseDetailsFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Details Retrieved Successfully",
        data: result
    })
});

export const CourseController = {
    createCourse,
    courseDetails,
    getCourse
}