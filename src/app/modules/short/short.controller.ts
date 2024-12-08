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
        statusCode: StatusCodes.OK,
        success: true,
        message: "Created Short Successfully",
        data: result
    })
});

const getShortList = catchAsync(async(req: Request, res: Response)=>{
    const result = await ShortService.getShortFromDB(req.user, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Short List Retrieved Successfully",
        data: result
    })
});

const teacherShortList = catchAsync(async(req: Request, res: Response)=>{

    const result = await ShortService.teacherShortFromDB(req.user, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Short List Retrieved Successfully",
        data: result
    })
});

const shortDetails = catchAsync(async(req: Request, res: Response)=>{

    const result = await ShortService.shortDetailsFromDB(req.params.id, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: true,
        message: "Short Details Retrieved Successfully",
        data: result
    })
});

const singleShortDetails = catchAsync(async(req: Request, res: Response)=>{

    const result = await ShortService.singleShortFromDB( req.user, req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Short Details Retrieved Successfully",
        data: result
    })
});

const getReels = catchAsync(async(req: Request, res: Response)=>{

    const result = await ShortService.getReelsFromDB(req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reels Retrieved Successfully",
        data: result
    })
});

export const ShortController = {
    createShort,
    getShortList,
    shortDetails,
    teacherShortList,
    singleShortDetails,
    getReels    
}