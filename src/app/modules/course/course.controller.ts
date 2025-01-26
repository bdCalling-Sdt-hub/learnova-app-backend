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
    
    const result = await CourseService.getCourseFromDB(req.user, req.query.search as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Retrieved Successfully",
        data: result
    })
});

const getCourseForStudent = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.getCourseForStudentFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Retrieved Course List Successfully",
        data: result
    })
});

const courseOverview = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.courseOverviewFromDB(req.params.id, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Details Retrieved Successfully",
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

const teacherDetails = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.teacherDetailsFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Teacher Details Retrieved Successfully",
        data: result
    })
});

const courseDetailsForStudent = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.courseDetailsForStudentFromDB(req.user, req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Details For Student Retrieved Successfully",
        data: result
    })
});


const courseAnalytics = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await CourseService.courseAnalyticsFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Details For Student Retrieved Successfully",
        data: result
    })
});

export const CourseController = {
    createCourse,
    courseOverview,
    courseDetails,
    getCourse,
    getCourseForStudent,
    teacherDetails,
    courseDetailsForStudent,
    courseAnalytics
}