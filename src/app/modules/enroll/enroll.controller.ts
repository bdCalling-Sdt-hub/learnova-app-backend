import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { EnrollService } from "./enroll.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createEnrollCourse = catchAsync (async (req: Request, res: Response)=>{
    const payload = {
        student : req.user.id,
        ...req.body
    }
    const result = await EnrollService.createEnrollCourseToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "You are enrolled in the course Successfully",
        data: result
    })

});

const enrollCourseDetails = catchAsync (async (req: Request, res: Response)=>{

    const result = await EnrollService.enrollCourseDetailsFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Enroll Course Details Retrieved Successfully",
        data: result
    })

});

export const EnrollController =  {
    createEnrollCourse,
    enrollCourseDetails
}