import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { LikeService } from "./like.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const toggleLike = catchAsync(async(req:Request, res:Response)=>{

    const payload = {
        student: req.user.id,
        ...req.body
    }
    const result = await LikeService.toggleLikeToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result
    })
});

const likeCount = catchAsync(async(req:Request, res:Response)=>{

    const result = await LikeService.likeCountFromDB(req.user,  req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Like Count Retrieved Successfully",
        data: result
    })
});


export const LikeController = {
    toggleLike,
    likeCount
}