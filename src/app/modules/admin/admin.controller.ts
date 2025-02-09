import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const studentsList = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getStudentsFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Students Retrieved Successfully',
        data: result
    });
});


const teachersList = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getTeachersFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Teachers Retrieved Successfully',
        data: result
    });
});

const studentsDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.studentDetailsFromDB(req.params.id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Students Retrieved Successfully',
        data: result
    });
});

const teachersDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.teacherDetailsFromDB(req.params.id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Teachers Retrieved Successfully',
        data: result
    });
});


const analyticsChart = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.chartAnalyticsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Analytics Retrieved Successfully',
        data: result
    });
});


const topCoursesAndShorts = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.topCoursesAndShortsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Top Courses and Shorts Retrieved Successfully',
        data: result
    });
});

const approvedAndRejectedTeacher = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.approvedAndRejectedTeacherFromDB(req.params.id, req.body.status);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Approved and Rejected Teacher Retrieved Successfully',
        data: result
    });
});


const countSummary = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.countSummaryFromDB();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Count Summery Retrieved Successfully',
        data: result
    });
});


const salesRevenue = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.salesRevenueFromDB();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Sales and revenue Retrieved Successfully',
        data: result
    });
});

const percentageSubscription = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.percentageSubscriptionFromDB();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Subscription Percentage Retrieved Successfully',
        data: result
    });
});


const metrics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.metricsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Metrics data Retrieved Successfully',
        data: result
    });
});

export const AdminController = {
    studentsList,
    teachersList,
    studentsDetails,
    teachersDetails,
    analyticsChart,
    topCoursesAndShorts,
    approvedAndRejectedTeacher,
    countSummary,
    salesRevenue,
    percentageSubscription,
    metrics
}