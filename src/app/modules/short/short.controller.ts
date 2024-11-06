import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ShortService } from "./short.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createShort = catchAsync(async(req: Request, res: Response)=>{

    const payload ={
        teacher: req.user.id,
        ...req.body
    }
    const result = await ShortService.createShortToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: true,
        message: "Created Short Successfully",
        data: result
    })
});

export const ShortController = {createShort}