import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ViewService } from "./view.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createView = catchAsync(async (req: Request, res: Response) => {

    const result = await ViewService.createViewToDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "View Created Successfully",
        data: result
    })
});

const viewStatistic = catchAsync(async (req: Request, res: Response) => {

    const result = await ViewService.viewStatisticFromDB(req.user, req.query.duration as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "View Retrieved Successfully",
        data: result
    })
});

const watchTimeStatistic = catchAsync(async (req: Request, res: Response) => {

    const result = await ViewService.watchTimeStatisticFromDB(req.user, req.query.duration as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Watch Time Retrieved Successfully",
        data: result
    })
});




export const ViewController = { createView, viewStatistic, watchTimeStatistic }