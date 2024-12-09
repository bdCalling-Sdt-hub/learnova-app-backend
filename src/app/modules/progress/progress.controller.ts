import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ProgressService } from "./progress.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createProgress = catchAsync(async(req: Request, res: Response) =>{
    const payload = {
        student : req.user.id,
        ...req.body
    }
    const result = await ProgressService.createProgressToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Progress created Successfully",
        data: result

    })
});

export const ProgressController = {
    createProgress
}