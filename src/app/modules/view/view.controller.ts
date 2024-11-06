import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ViewService } from "./view.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createView = catchAsync(async(req:Request, res: Response)=>{
    const payload = {
        student: req.user.id,
        ...req.body
    }

    const result = await ViewService.createViewToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "View Created Successfully",
        data: result
    })
});

export const ViewController = { createView }